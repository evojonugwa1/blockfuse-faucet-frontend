"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { useReadContract, useWriteContract } from "wagmi";
import { faucetAbi, nftAbi, faucetAddress, nftAddress } from "../utils/contracts";
import Image from "next/image";

export default function BlockfuseFaucet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const formattedAddress = address as `0x${string}`; // ✅ Explicit type assertion
  const formattedFaucetAddress = faucetAddress as `0x${string}`;
  const formattedNftAddress = nftAddress as `0x${string}`;

  const { data: ownsNFT } = useReadContract({
    address: formattedNftAddress,
    abi: nftAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const { writeContract: claimETH, isPending } = useWriteContract();
  const { writeContract: mintNFT, isPending: isMinting } = useWriteContract();

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 text-black">
      {/* Header */}
      <header className="w-full flex justify-between items-center p-6 bg-white shadow-md">
        <div className="flex items-center gap-2">
          <Image src="/assets/blockfuse-logo.png" alt="Blockfuse Labs" width={48} height={48} />
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
          <button
            onClick={() => mintNFT({ address: formattedNftAddress, abi: nftAbi, functionName: "mint", args: [formattedAddress] })}
            disabled={isMinting}
            className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-full disabled:bg-gray-400"
          >
            {isMinting ? "Minting..." : "Mint Blockfuse Labs NFT"}
          </button>
        </div>

        {/* Faucet Claim Section */}
        <div className="flex-1 flex flex-col items-center p-6 text-center">
          <h2 className="text-2xl font-semibold">Claim Free Sepolia ETH</h2>
          <p className="text-gray-600 mt-2">You must own a Blockfuse NFT to claim.</p>
          {ownsNFT && Number(ownsNFT) > 0 ? (
            <button
              onClick={() => claimETH({ address: formattedFaucetAddress, abi: faucetAbi, functionName: "claimETH" })}
              disabled={isPending}
              className="mt-4 px-6 py-3 bg-green-500 text-white rounded-full disabled:bg-gray-400"
            >
              {isPending ? "Claiming..." : "Claim 0.01 ETH"}
            </button>
          ) : (
            <button
              disabled
              className="mt-4 px-6 py-3 bg-green-500 text-white rounded-full disabled:bg-gray-400"
            >
              You need to mint an NFT first before claiming ETH.
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-4 flex justify-center bg-gray-200">
        <p className="text-gray-600">Blockfuse Labs Faucet</p>
      </footer>
    </div>
  );
}