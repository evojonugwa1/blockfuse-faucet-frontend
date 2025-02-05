// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;



contract BlockfuseNFT is ERC721, Ownable {
    uint256 public tokenCounter;
    mapping(address => bool) public hasMinted;

    constructor() ERC721("BlockfuseNFT", "BFN") Ownable(msg.sender) {
        tokenCounter = 0;
    }

    function mint(address to) public {
    require(!hasMinted[to], "You already own an NFT");
    hasMinted[to] = true;
    uint256 tokenId = tokenCounter;
    _safeMint(to, tokenId);
    tokenCounter += 1;
}

    function exists(uint256 tokenId) public view returns (bool) {
        try this.ownerOf(tokenId) {
            return true;
        } catch {
            return false;
        }
    }
}