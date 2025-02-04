"use client";
import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect(); // ✅ Fetch available connectors
  const { disconnect } = useDisconnect();

  return (
    <div className="flex flex-col items-center">
      {isConnected ? (
        <>
          <p className="text-white">
            Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
          <button
            onClick={() => disconnect()}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
          >
            Disconnect
          </button>
        </>
      ) : (
        <button
          onClick={() => connect({ connector: connectors[0] })} // ✅ Use first available connector
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
