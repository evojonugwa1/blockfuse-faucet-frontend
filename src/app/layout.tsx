"use client"
// import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { WagmiProvider, createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ Define the Wagmi Config
const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL),
  },
});

// export const metadata: Metadata = {
//   title: "Blockfuse Faucet APp",
//   description: "Claim free ETH from the Sepolia Faucet",
// };


// ✅ Initialize QueryClient
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* ✅ Wrap the entire app with WagmiProvider */}
        <QueryClientProvider client={queryClient}>

        <WagmiProvider config={config}>{children}</WagmiProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
