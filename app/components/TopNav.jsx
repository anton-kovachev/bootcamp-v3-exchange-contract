"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useSDK } from "@metamask/sdk-react";
import { useProvider } from "../hooks/useProvider";

function TopNav() {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");
  const { sdk } = useSDK();
  const { provider } = useProvider();

  const connectHandler = async () => {
    try {
      debugger;
      await sdk.connectAndSign({ msg: "Sign in to DAPP Exchange." });
      await getAccountInfo();
    } catch (error) {
      console.log(error);
    }
  };

  const getAccountInfo = async () => {
    if (provider) {
      const account = await provider.getSigner();
      setAccount(account.address);
      setBalance(await provider.getBalance(account));
    }
  };

  useEffect(() => {
    if (sdk) {
      connectHandler();
    }
  }, [provider]);

  return (
    <nav className="topnav">
      <p>My Account: {account}</p>
      <p>My Balance: {balance}</p>
    </nav>
  );
}

export default TopNav;
