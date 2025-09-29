import { useState, useEffect } from "react";
import { useSDK } from "@metamask/sdk-react";
import { ethers } from "ethers";
import { chain } from "lodash";

export function useProvider() {
    const { sdk, chainId } = useSDK();
    const [provider, setProvider] = useState(null);

    useEffect(() => {
        if (sdk) {
            const ethereum = sdk.getProvider();
            const provider = new ethers.BrowserProvider(ethereum);
            setProvider(provider);
        }
    }, [sdk]);

    return { provider, chainId };
}