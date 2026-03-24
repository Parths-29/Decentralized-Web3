from scripts.helpful_scripts import get_account
from brownie import Voting

def deploy_voting():
    account = get_account()
    # Cryptographically secure and gas efficient bytes32 strings
    Candidates = [b"Putin".ljust(32, b'\0'), b"Modi".ljust(32, b'\0')]
    
    # Deploying heavily optimized contract
    voting = Voting.deploy(Candidates, {"from": account})
    return voting

def main():
    deploy_voting()