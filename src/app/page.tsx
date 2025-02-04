"use client";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { useReadContract, useWriteContract } from "wagmi";
import { ethers } from "ethers";
import { faucetAbi, nftAbi, faucetAddress, nftAddress } from "../utils/contracts";

export default function BlockfuseFaucet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const formattedAddress = address as `0x${string}`;
  const formattedFaucetAddress = faucetAddress as `0x${string}`;
  const formattedNftAddress = nftAddress as `0x${string}`;

  // Check if the user owns an NFT
  const { data: ownsNFT, isLoading: isCheckingOwnership, error: ownsNftError } = useReadContract({
    address: formattedNftAddress,
    abi: nftAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  // Get the faucet balance
  const { data: faucetBalance, error: faucetBalanceError, isLoading: isFaucetBalanceLoading } = useReadContract({
    address: formattedFaucetAddress,
    abi: faucetAbi,
    functionName: "getBalance",
  });

  // Get the last claimed timestamp for the user
  

  // Calculate if the user can claim ETH
  const canClaim =
    ownsNFT && Number(ownsNFT) > 0 && // User must own at least one NFT
    (!lastClaimedTimestamp || // If no previous claim
      (lastClaimedTimestamp.data &&
        typeof lastClaimedTimestamp.data === "bigint" &&
        BigInt(lastClaimedTimestamp.data) + BigInt(86400) <= BigInt(Math.floor(Date.now() / 1000)))); // Cooldown period (24 hours)

  // Write contract for claiming ETH
  const { writeContract: claimETH, isPending: isClaiming, error: claimError } = useWriteContract();

  // Write contract for minting NFTs
  const { writeContract: mintNFT, isPending: isMinting, error: mintError } = useWriteContract();

  // Log relevant data for debugging
  console.log("User Address:", formattedAddress);
  console.log("Is Connected:", isConnected);
  console.log("Owns NFT:", ownsNFT, ownsNftError);
  console.log("Faucet Balance:", faucetBalance, faucetBalanceError, isFaucetBalanceLoading);
  console.log("Last Claimed Timestamp:", lastClaimedTimestamp);
  console.log("Can Claim:", canClaim);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 text-black">
      {/* Header */}
      <header className="w-full flex justify-between items-center p-6 bg-white shadow-md">
        <div className="flex items-center gap-2">
          <p className="text-lg font-bold">Blockfuse Labs</p>
        </div>
        {isConnected ? (
          <button onClick={() => disconnect()} className="px-4 py-2 bg-red-500 text-white rounded">
            Disconnect ({formattedAddress.slice(0, 6)}...{formattedAddress.slice(-4)})
          </button>
        ) : (
          <button
            onClick={() => connect({ connector: connectors?.[0] || injected() })}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Connect Wallet
          </button>
        )}
      </header>

      {/* Main Section */}
      <div className="flex w-full flex-col lg:flex-row items-center justify-center py-16">
        {/* NFT Minting Section */}
        <div className="flex-1 flex flex-col items-center p-6 text-center">
        <h1 className="text-4xl font-bold">Mint Your Blockfuse Labs NFT</h1>
        {mintError && <p className="text-red-500">{mintError.message}</p>}
        <button
          onClick={() =>
            mintNFT({
              address: formattedNftAddress,
              abi: nftAbi,
              functionName: "mint",
              args: [formattedAddress], // Mint NFT for the connected wallet
            })
          }
          disabled={
            isMinting ||
            !isConnected ||
            (ownsNFT !== undefined && Number(ownsNFT) > 0) || // Disable if the user already owns an NFT
            isCheckingOwnership
          }
          className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-full disabled:bg-gray-400"
        >
          {isMinting
            ? "Minting..."
            : ownsNFT !== undefined && Number(ownsNFT) > 0
            ? "You already own an NFT"
            : isCheckingOwnership
            ? "Checking ownership..."
            : "Mint Blockfuse Labs NFT"}
        </button>
      </div>

        {/* Faucet Claim Section */}
        <div className="flex-1 flex flex-col items-center p-6 text-center">
          <h2 className="text-2xl font-semibold">Claim Free Sepolia ETH</h2>
          <p className="text-gray-600 mt-2">You must own a Blockfuse NFT to claim.</p>

          {claimError && <p className="text-red-500">{claimError.message}</p>}

          <p className="mt-2 text-sm">
            Faucet Balance:{" "}
            {faucetBalance && typeof faucetBalance === "bigint"
              ? ethers.formatEther(faucetBalance.toString())
              : isFaucetBalanceLoading
              ? "Loading..."
              : "0"}{" "}
            ETH
          </p>

          {ownsNFT && Number(ownsNFT) > 0 ? (
            <button
              onClick={() =>
                claimETH({ address: formattedFaucetAddress, abi: faucetAbi, functionName: "claimETH" })
              }
              disabled={isClaiming || !canClaim}
              className="mt-4 px-6 py-3 bg-green-500 text-white rounded-full disabled:bg-gray-400"
            >
              {isClaiming
                ? "Claiming..."
                : canClaim
                ? "Claim 0.01 ETH"
                : "Claim 0.01 ETH (Cooldown Active)"}
            </button>
          ) : (
            <button disabled className="mt-4 px-6 py-3 bg-green-500 text-white rounded-full disabled:bg-gray-400">
              You need to mint an NFT first
            </button>
          )}
        </div>
      </div>
    </div>
  );
}