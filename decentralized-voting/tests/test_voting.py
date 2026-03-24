import pytest
from brownie import Voting, accounts, reverts, web3

@pytest.fixture
def deployer():
    return accounts[0]

@pytest.fixture
def candidates():
    return [b"Alice".ljust(32, b'\0'), b"Bob".ljust(32, b'\0')]

@pytest.fixture
def voting(deployer, candidates):
    return Voting.deploy(candidates, {'from': deployer})

def test_deployment(voting, deployer, candidates):
    assert voting.chairperson() == deployer
    assert voting.state() == 0  # COMMIT phase
    assert voting.candidates(0)[0] == candidates[0]
    assert voting.candidates(1)[0] == candidates[1]

# Generates 10 separate tests for successful commits
@pytest.mark.parametrize("voter_id", range(1, 11))
def test_valid_commit(voting, voter_id):
    voter = accounts[voter_id % 10]
    c_index = voter_id % 2
    secret = b"my_secret".ljust(32, b'\0')
    commitment = web3.solidityKeccak(['uint256', 'bytes32'], [c_index, secret])
    
    voting.commitVote(commitment, {'from': voter})
    assert voting.voters(voter)[0] == commitment
    assert voting.voters(voter)[1] is False

# Generates 10 tests verifying double votes are prevented cleanly
@pytest.mark.parametrize("voter_id", range(1, 11))
def test_prevent_double_commit(voting, voter_id):
    voter = accounts[voter_id % 10]
    secret = b"another_secret".ljust(32, b'\0')
    commitment = web3.solidityKeccak(['uint256', 'bytes32'], [0, secret])
    
    voting.commitVote(commitment, {'from': voter})
    # Should revert due to custom error AlreadyVoted()
    with reverts(): 
        voting.commitVote(commitment, {'from': voter})

# Generates 10 tests verifying reveal attempts during COMMIT phase fail
@pytest.mark.parametrize("voter_id", range(1, 11))
def test_reveal_fails_in_commit_phase(voting, voter_id):
    voter = accounts[voter_id % 10]
    with reverts():
        voting.revealVote(0, b"fake".ljust(32, b'\0'), {'from': voter})

def test_state_transitions(voting, deployer):
    voting.changeState(1, {'from': deployer})
    assert voting.state() == 1
    voting.changeState(2, {'from': deployer})
    assert voting.state() == 2

# Generates 10 tests for successful reveal processes
@pytest.mark.parametrize("voter_id", range(1, 11))
def test_valid_reveal(voting, deployer, voter_id):
    voter = accounts[voter_id % 10]
    c_index = voter_id % 2
    secret = b"secure_pass".ljust(32, b'\0')
    commitment = web3.solidityKeccak(['uint256', 'bytes32'], [c_index, secret])
    
    voting.commitVote(commitment, {'from': voter})
    voting.changeState(1, {'from': deployer}) # Transition to REVEAL phase
    
    voting.revealVote(c_index, secret, {'from': voter})
    assert voting.voters(voter)[1] is True
    assert voting.candidates(c_index)[1] == 1

# Generates 10 tests for invalid reveals (wrong cryptographic secret)
@pytest.mark.parametrize("voter_id", range(1, 11))
def test_invalid_reveal_wrong_secret(voting, deployer, voter_id):
    voter = accounts[voter_id % 10]
    c_index = 0
    secret = b"secure_pass".ljust(32, b'\0')
    commitment = web3.solidityKeccak(['uint256', 'bytes32'], [c_index, secret])
    
    voting.commitVote(commitment, {'from': voter})
    voting.changeState(1, {'from': deployer})
    
    wrong_secret = b"wrong_pass".ljust(32, b'\0')
    with reverts():
        voting.revealVote(c_index, wrong_secret, {'from': voter})

# Security test: Ensure non-chairperson cannot change state
def test_non_chairperson_cannot_change_state(voting):
    non_chair = accounts[1]
    with reverts():
        voting.changeState(1, {'from': non_chair})
