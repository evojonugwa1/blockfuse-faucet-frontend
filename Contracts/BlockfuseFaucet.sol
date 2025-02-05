// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;




contract SepoliaFaucet is Ownable { // ✅ Inherit Ownable
    IERC721 public nftContract;
    mapping(address => uint256) public lastClaimedTimestamp;

    constructor(address _nftContractAddress) Ownable(msg.sender) { // ✅ Pass msg.sender to Ownable
        nftContract = IERC721(_nftContractAddress);
    }

    // Function to check if the user owns at least one NFT
    function ownsNFT(address user) public view returns (bool) {
        return nftContract.balanceOf(user) > 0;
    }

    // Function to allow users to claim Sepolia ETH
    function claimETH() external {
        require(ownsNFT(msg.sender), "You must own an NFT to claim ETH");
        require(
            lastClaimedTimestamp[msg.sender] + 1 days <= block.timestamp,
            "You can only claim once every 24 hours"
        );
        require(address(this).balance >= 0.001 ether, "Faucet is empty");

        lastClaimedTimestamp[msg.sender] = block.timestamp;
        payable(msg.sender).transfer(0.001 ether); // Send 0.001 Sepolia ETH
    }

    // Fallback function to receive ETH (for funding the faucet)
    receive() external payable {}

    // Function to withdraw funds from the faucet (only owner)
    function withdrawFunds() external onlyOwner { // ✅ Only contract owner can withdraw
        payable(owner()).transfer(address(this).balance);
    }

    // Function to check the balance of the faucet
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
