"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ethers } from "ethers";
import { MetaMaskProvider, useSDK, metamask } from "@metamask/sdk-react";
import { useProvider } from "../hooks/useProvider";

import network from "@/app/assets/other/network.svg";
import config from "@/app/config.json";
import Jazzicon from "react-jazzicon";

function TopNav() {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");
  const { sdk, provider: metamask } = useSDK();
  const { provider, chainId } = useProvider();

  const networkHandler = async (event) => {
    await metamask.request({
      method: "wallet_switchEhtereumChain",
      params: [{ chainId: event.target.value }],
    });
  };

  const connectHandler = async () => {
    try {
      debugger;
      if (provider) {
        await sdk.connectAndSign({ msg: "Sign in to DAPP Exchange." });
        await getAccountInfo();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAccountInfo = async () => {
    const account = await provider.getSigner();
    const balance = await provider.getBalance(account);
    setAccount(account.address);
    console.log(ethers.formatEther(balance));
    setBalance(ethers.formatEther(balance));
  };

  useEffect(() => {
    if (sdk && metamask) {
      metamask.on("accountsChanged", async (accounts) => {
        debugger;
        if (!accounts?.length) {
          setAccount(null);
          setBalance(0);
        } else {
          await getAccountInfo();
        }
      });
    }

    metamask.on("chainChanged", () => window.location.reload());

    return () => {
      metamask?.removeAllListeners();
    };
  }, [sdk, metamask]);

  return (
    <nav className="topnav">
      <div className="network">
        <label className="icon" htmlFor="network">
          <Image src={network} alt="Select Network"></Image>
        </label>
        <div className="select">
          <select
            name="network"
            id="network"
            value={config[Number(chainId)] ? chainId : 0}
            onChange={networkHandler}
          >
            <option value="0">Select</option>
            <option value="0x7a69">Hardhat</option>
          </select>
        </div>
      </div>

      <div className="account">
        {account && (
          <div className="balance">
            <p>
              My Balance <span>{Number(balance).toFixed(2)} ETH</span>
            </p>
          </div>
        )}
        {account ? (
          <a
            href={`https://etherscan.io/address/${account}`}
            target="_blank"
            rel="noreferrer"
            className="link"
          >
            {account.slice(0, 6) + "..." + account.slice(38, 42)}
            <Jazzicon diameter={44} seed={account} />
          </a>
        ) : (
          <button onClick={connectHandler} className="button">
            Connect
          </button>
        )}
      </div>
    </nav>
  );
}

export default TopNav;
