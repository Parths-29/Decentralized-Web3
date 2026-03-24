// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

error VotingClosed();
error NotInRevealPhase();
error AlreadyVoted();
error InvalidCommitment();
error InvalidCandidate();
error NotChairperson();

/**
 * @title Voting
 * @dev Implements a Commit-Reveal cryptographic voting scheme for voter anonymity.
 * Highly optimized for gas efficiency utilizing custom errors and tightly packed structs.
 */
contract Voting {
    struct Voter {
        bytes32 commitment; // Hashed secret commitment
        bool hasRevealed;   // Tracks if vote has been tallied
    }
    
    struct Candidate {
        bytes32 name;       // 32 bytes avoids expensive dynamic string arrays
        uint32 voteCount;   // 4 bytes, tightly packed logic
    }

    enum ElectionState { COMMIT, REVEAL, CLOSED }
    ElectionState public state;
    
    address public immutable chairperson;
    bytes32 public winnerName;
    
    mapping(address => Voter) public voters;
    Candidate[] public candidates;

    constructor(bytes32[] memory candidateNames) {
        chairperson = msg.sender;
        state = ElectionState.COMMIT;
        
        for (uint i = 0; i < candidateNames.length; i++) {
            candidates.push(Candidate({
                name: candidateNames[i],
                voteCount: 0
            }));
        }
    }

    modifier onlyChairperson() {
        if (msg.sender != chairperson) revert NotChairperson();
        _;
    }

    /**
     * @dev Step 1: Submit a hashed commitment `keccak256(abi.encodePacked(candidateIndex, secret))`
     */
    function commitVote(bytes32 _commitment) external {
        if (state != ElectionState.COMMIT) revert VotingClosed();
        if (voters[msg.sender].commitment != 0) revert AlreadyVoted();
        
        voters[msg.sender].commitment = _commitment;
    }

    /**
     * @dev Step 2: Reveal the candidate index and secret to tally the vote
     */
    function revealVote(uint256 _candidateIndex, bytes32 _secret) external {
        if (state != ElectionState.REVEAL) revert NotInRevealPhase();
        Voter storage sender = voters[msg.sender];
        
        if (sender.hasRevealed) revert AlreadyVoted();
        if (sender.commitment == 0) revert InvalidCommitment();
        if (_candidateIndex >= candidates.length) revert InvalidCandidate();

        // Cryptographically verify voter's commitment matches the revealed data
        bytes32 expectedCommitment = keccak256(abi.encodePacked(_candidateIndex, _secret));
        if (expectedCommitment != sender.commitment) revert InvalidCommitment();

        sender.hasRevealed = true;
        candidates[_candidateIndex].voteCount += 1;
    }

    /**
     * @dev Admin function to transition between COMMIT, REVEAL, and CLOSED phases
     */
    function changeState(ElectionState _newState) external onlyChairperson {
        state = _newState;
        if (_newState == ElectionState.CLOSED) {
            _tallyWinner();
        }
    }

    /**
     * @dev Calculates the final winner once the election automatically closes
     */
    function _tallyWinner() internal {
        uint32 winningVoteCount = 0;
        uint256 winningIndex = 0;
        
        for (uint256 p = 0; p < candidates.length; p++) {
            if (candidates[p].voteCount > winningVoteCount) {
                winningVoteCount = candidates[p].voteCount;
                winningIndex = p;
            }
        }
        
        if (candidates.length > 0) {
            winnerName = candidates[winningIndex].name;
        }
    }
}