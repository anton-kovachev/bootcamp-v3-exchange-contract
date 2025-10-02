import { useEffect, useState } from "react";
import { useProvider } from "./useProvider";

import Token from "@/app/abis/Token.json"
import config from "@/app/config.json"
import { ethers } from "ethers";

export function useTokens() {
    const { provider, chainId } = useProvider();
    const [tokens, setTokens] = useState(null);


    useEffect(() => {
        if (provider) {
            if (!config[Number(chainId)]) return;
            const contracts = {};
            config[Number(chainId)]["tokens"].forEach(x => {
                contracts[x.address] = new ethers.Contract(x.address, Token, provider);
            });

            setTokens(contracts);
        }

    }, [provider]);

    return { tokens };
}