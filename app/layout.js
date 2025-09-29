import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Lexend } from "next/font/google";

const lexend = Lexend({ subsets: ['latin'] });

import MetaMaskProvider from "./components/providers/MetaMaskProvider";
import TopNav from "./components/TopNav";

export const metadata = {
  title: "DAAP Exchange",
  description: "Your favourite peer to peer orderbook exchange.",
};

export default function RootLayout({ children }) {
  return (
    <MetaMaskProvider>
      <html lang="en">
        <body className={`${lexend.className}`}>
          <main className="content">
            <TopNav />
            {children}
          </main>
        </body>
      </html>
    </MetaMaskProvider>
  );
}
