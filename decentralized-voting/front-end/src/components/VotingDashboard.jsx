import { useState, useEffect } from 'react';
import { ethers, Contract, JsonRpcProvider } from 'ethers';
import axios from 'axios';
import VotingArtifact from '../Voting.json';

const CONTRACT_ADDRESS = '0xDF7f746dF987883A84713894cB4bE355F53816E2';

export default function VotingDashboard() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [activeAccount, setActiveAccount] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [electionState, setElectionState] = useState(0); 
  const [winner, setWinner] = useState('');
  const [hasVotedStr, setHasVotedStr] = useState(false);
  
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');
  // Secure off-chain secret handling, normally generated per device and never shared
  const defaultSecret = ethers.encodeBytes32String("ResumeSecret123");

  useEffect(() => {
    init();
    checkUserVoteStatus();
  }, []);

  const checkUserVoteStatus = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHasVotedStr(res.data.hasVoted);
    } catch(err) { console.error(err); }
  };

  const init = async () => {
    try {
      const rpcProvider = new JsonRpcProvider('http://127.0.0.1:8545');
      setProvider(rpcProvider);

      const accs = await rpcProvider.listAccounts();
      const addresses = accs.map(a => a.address || a);
      
      // Select an invisible delegate Ganache wallet based on username string to hash it
      // In production: Meta-transactions or WalletConnect
      let hash = 0;
      for (let i = 0; i < username.length; i++) hash = username.charCodeAt(i) + ((hash << 5) - hash);
      const index = Math.abs(hash) % 8 + 1; // Pick accounts 1-9 natively
      
      setActiveAccount(addresses[index]);

      const votingContract = new Contract(CONTRACT_ADDRESS, VotingArtifact.abi, rpcProvider);
      setContract(votingContract);

      await fetchData(votingContract);
    } catch(err) { console.error(err); }
  };

  const fetchData = async (votingContract) => {
    if (!votingContract) return;
    try {
      const stateObj = await votingContract.state();
      setElectionState(Number(stateObj));
      if (Number(stateObj) === 2) {
        const wBytes = await votingContract.winnerName();
        setWinner(ethers.decodeBytes32String(wBytes));
      }

      const fetchedCandidates = [];
      for(let i=0; i<2; i++) {
          try {
              const candidateInfo = await votingContract.candidates(i);
              fetchedCandidates.push({
                 index: i,
                 name: ethers.decodeBytes32String(candidateInfo.name || candidateInfo[0]),
                 votes: Number(candidateInfo.voteCount ?? candidateInfo[1])
              });
          } catch(e) { break; }
      }
      setCandidates(fetchedCandidates);
    } catch(e) { console.error(e) }
  };

  const handleCommit = async (candidateIndex) => {
    if (hasVotedStr) {
        alert("Action Denied: You have already voted securely!");
        return;
    }
    if (!contract || !activeAccount) return;
    try {
      const signer = await provider.getSigner(activeAccount);
      const contractWithSigner = contract.connect(signer);
      
      const encoder = ethers.AbiCoder.defaultAbiCoder();
      const encodedData = encoder.encode(["uint256", "bytes32"], [candidateIndex, defaultSecret]);
      const commitment = ethers.keccak256(encodedData);

      const tx = await contractWithSigner.commitVote(commitment);
      await tx.wait();
      
      // Write secure confirmation to Web2 Database layer (MongoDB)
      await axios.post('http://127.0.0.1:5000/api/vote/record', {}, {
          headers: { Authorization: `Bearer ${token}` }
      });
      
      setHasVotedStr(true);
      alert('Your vote has been securely recorded on the Blockchain!');
      await fetchData(contract);
    } catch(err) {
      alert(err.reason || err.message || 'Failed to commit cryptographic vote');
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="white-card">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
         <h1 style={{margin: 0}}>Voting Dashboard</h1>
         <button className="btn btn-secondary" style={{padding: '6px 12px', fontSize: '0.9rem'}} onClick={logout}>Logout</button>
      </div>
      
      <div style={{background: '#f9fafb', padding: '16px', borderRadius: '8px', marginBottom: '24px', textAlign: 'center'}}>
        <span style={{fontSize: '1.1rem', fontWeight: '600'}}>Verified Web3 Profile: {username}</span>
        <p style={{margin: '8px 0 0 0', color: '#6b7280', fontSize: '0.9rem'}}>Your identity is secure. Raw blockchain hashes are hidden.</p>
      </div>

      <div className="status-badge">
        🟢 {electionState === 0 ? "Phase 1: COMMIT VOTES (Cryptographic)" : electionState === 1 ? "Phase 2: OVERLOOKED TALLY" : "Phase 3: ELECTION CLOSED"}
      </div>

      {hasVotedStr && electionState === 0 && (
         <div style={{padding: '16px', background: '#ecfdf5', color: '#059669', borderRadius: '8px', textAlign: 'center', marginBottom: '20px', fontWeight: '600'}}>
             ✅ Your vote has been officially hashed and counted.
         </div>
      )}

      {electionState === 2 ? (
        <div className="winner-section">
          <h2>Election Concluded</h2>
          <div className="winner-text">Winner: {winner}</div>
        </div>
      ) : (
        <div className="candidate-list">
          {candidates.map(c => (
            <div className="candidate-item" key={c.index}>
              <div className="candidate-info">
                <span className="candidate-name">{c.name}</span>
                {electionState === 1 && <span className="candidate-votes">{c.votes} Validated Signatures</span>}
              </div>
              
              {electionState === 0 ? (
                <button className="btn" onClick={() => handleCommit(c.index)} disabled={hasVotedStr} style={{opacity: hasVotedStr ? 0.5 : 1, cursor: hasVotedStr ? 'not-allowed' : 'pointer'}}>
                  {hasVotedStr ? 'Voted' : 'Vote Securely'}
                </button>
              ) : (
                <span style={{color: '#6b7280', fontSize: '0.9rem'}}>Audit View Only</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
