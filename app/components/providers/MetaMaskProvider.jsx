"use client";
import { MetaMaskProvider as Provider } from "@metamask/sdk-react";
function MetaMaskProvider({ children }) {
  const host =
    typeof window !== "undefined" ? window.location.href : "defaultHost";

  const sdkOptions = {
    logging: { developerMode: false },
    checkInstallationImmediately: false,
    dappMetadata: { name: "DAPP Exchange", url: host },
  };

  return (
    <Provider debug={false} sdkOptions={sdkOptions}>
      {children}
    </Provider>
  );
}

export default MetaMaskProvider;
