import { useState, useEffect } from 'react';
import { ethers, Contract, JsonRpcProvider } from 'ethers';
import axios from 'axios';
import VotingArtifact from '../Voting.json';

const CONTRACT_ADDRESS = '0xDF7f746dF987883A84713894cB4bE355F53816E2';

export default function AdminDashboard() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [adminAccount, setAdminAccount] = useState('');
  const [electionState, setElectionState] = useState(0); 
  const [metrics, setMetrics] = useState({ totalUsers: 0, totalVotes: 0, users: [] });
  
  const token = localStorage.getItem('token');

  useEffect(() => {
    init();
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/api/admin/metrics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMetrics(res.data);
    } catch(err) { console.error(err); }
  };

  const init = async () => {
    try {
      const rpcProvider = new JsonRpcProvider('http://127.0.0.1:8545');
      setProvider(rpcProvider);
      const accs = await rpcProvider.listAccounts();
      const address = accs[0].address || accs[0];
      setAdminAccount(address);

      const votingContract = new Contract(CONTRACT_ADDRESS, VotingArtifact.abi, rpcProvider);
      setContract(votingContract);
      await fetchContractState(votingContract);
    } catch(err) { console.error(err); }
  };

  const fetchContractState = async (votingContract) => {
      try {
        const state = await votingContract.state();
        setElectionState(Number(state));
      } catch(e) {}
  };

  const handleNextPhase = async () => {
    try {
        if (!window.confirm("Are you sure you want to enforce phase transition?")) return;
      const signer = await provider.getSigner(adminAccount);
      const contractWithSigner = contract.connect(signer);
      const nextState = electionState + 1;
      const tx = await contractWithSigner.changeState(nextState);
      await tx.wait();
      await fetchContractState(contract);
      alert("Successfully transitioned Blockchain State!");
    } catch(err) { alert("Failed to advance chain phase. Only Deployer can do this."); }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="white-card" style={{maxWidth: '700px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
         <h1 style={{margin: 0}}>Admin Control Center</h1>
         <button className="btn btn-secondary" style={{padding: '6px 12px'}} onClick={logout}>Sign Out</button>
      </div>

      <div style={{display: 'flex', gap: '16px', marginBottom: '24px'}}>
        <div style={{flex: 1, padding: '20px', background: '#f3f4f6', borderRadius: '12px', textAlign: 'center'}}>
           <h3 style={{margin: '0 0 4px', fontSize: '1.8rem', color: '#111827'}}>{metrics.totalUsers}</h3>
           <p style={{margin:0, color:'#6b7280', fontSize: '0.9rem'}}>Registered Web2 Users</p>
        </div>
        <div style={{flex: 1, padding: '20px', background: '#f3f4f6', borderRadius: '12px', textAlign: 'center'}}>
           <h3 style={{margin: '0 0 4px', fontSize: '1.8rem', color: '#111827'}}>{metrics.totalVotes}</h3>
           <p style={{margin:0, color:'#6b7280', fontSize: '0.9rem'}}>Votes Synced</p>
        </div>
      </div>

      <h3 style={{borderBottom: '1px solid #e5e7eb', paddingBottom: '10px'}}>Web2 Data Synchronization DB</h3>
      <table style={{width: '100%', textAlign: 'left', borderCollapse: 'collapse', marginBottom: '24px'}}>
        <thead>
          <tr style={{background: '#f9fafb'}}>
            <th style={{padding: '12px', borderBottom: '1px solid #e5e7eb', fontSize: '0.95rem'}}>Username Index</th>
            <th style={{padding: '12px', borderBottom: '1px solid #e5e7eb', fontSize: '0.95rem'}}>Off-Chain Vote Trigger</th>
          </tr>
        </thead>
        <tbody>
          {metrics.users.map(u => (
            <tr key={u._id}>
              <td style={{padding: '12px', borderBottom: '1px solid #e5e7eb', color: '#4b5563'}}>{u.username}</td>
              <td style={{padding: '12px', borderBottom: '1px solid #e5e7eb'}}>
                {u.hasVoted ? <span style={{color: '#059669', fontWeight: 'bold', fontSize: '0.9rem'}}>Confirmed</span> : <span style={{color: '#9ca3af', fontSize: '0.9rem'}}>Pending</span>}
              </td>
            </tr>
          ))}
          {metrics.users.length === 0 && (
             <tr>
               <td colSpan="2" style={{padding: '16px', textAlign: 'center', color: '#9ca3af'}}>No users registered yet.</td>
             </tr>
          )}
        </tbody>
      </table>

      <h3 style={{borderBottom: '1px solid #e5e7eb', paddingBottom: '10px'}}>On-Chain Controls (State: {electionState})</h3>
      <div style={{display: 'flex', gap: '16px'}}>
         <button className="btn btn-secondary" disabled={electionState >= 2} onClick={handleNextPhase} style={{width: '100%', background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca'}}>
            {electionState === 0 ? "FORCE END VOTING PHASE" : electionState === 1 ? "FINALIZE BLOCKCHAIN TALLY" : "ELECTION PERMANENTLY CLOSED"}
         </button>
      </div>
    </div>
  );
}
