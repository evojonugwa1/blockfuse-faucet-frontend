"use client"
import { useEffect, useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { faucetAbi, nftAbi, faucetAddress, nftAddress } from "../utils/contracts";

export default function Faucet() {
  const { address, isConnected } = useAccount();
  const [balance, setBalance] = useState("0");

  const formattedAddress = address as `0x${string}` | undefined; // ✅ Explicit type assertion
  const formattedFaucetAddress = faucetAddress as `0x${string}`;
  const formattedNftAddress = nftAddress as `0x${string}`;

  const { data: ownsNFT } = useReadContract({
    address: formattedNftAddress,
    abi: nftAbi,
    functionName: "ownsNFT",
    args: formattedAddress ? [formattedAddress] : undefined, // ✅ Ensuring correct type
  });

  const { data: contractBalance, refetch: fetchBalance } = useReadContract({
    address: formattedFaucetAddress,
    abi: faucetAbi,
    functionName: "getBalance",
  });

  const { writeContract: claimETH, isPending } = useWriteContract(); // ✅ `useWriteContract` replaces `useContractWrite`

  useEffect(() => {
    if (contractBalance) setBalance(contractBalance.toString());
  }, [contractBalance]);

  return (
    <div className="flex flex-col items-center bg-gray-800 p-6 rounded-xl text-white">
      <h1 className="text-2xl font-bold">Sepolia Faucet</h1>
      <p>Faucet Balance: {balance} ETH</p>
      {isConnected && (
        <>
          <p>{ownsNFT ? "You own an NFT!" : "You need an NFT to claim ETH."}</p>
          <button
            onClick={() =>
              claimETH({ address: formattedFaucetAddress, abi: faucetAbi, functionName: "claimETH" })
            }
            disabled={!ownsNFT || isPending}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-500"
          >
            {isPending ? "Claiming..." : "Claim 0.01 ETH"}
          </button>
        </>
      )}
    </div>
  );
}
