// src/utils/contracts.ts
export const faucetAddress = process.env.NEXT_PUBLIC_FAUCET_CONTRACT!;
export const nftAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT!;

export const faucetAbi = [
  // Core faucet functions
  "function claimETH() external",
  "function getBalance() public view returns (uint256)",
  "function ownsNFT(address user) public view returns (bool)",
  
  // Ownership management (from Ownable)
  "function owner() public view returns (address)",
  "function withdrawFunds() external",
  
  // State variables
  "function lastClaimedTimestamp(address) public view returns (uint256)",
] as const;

export const nftAbi = [
  {
    "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "name": "ownerOf",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [{ "internalType": "address", "name": "to", "type": "address" }],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [],
    "name": "tokenCounter",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "name": "exists",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function",
  },
] as const;
