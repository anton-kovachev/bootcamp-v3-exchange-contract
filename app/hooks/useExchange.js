import { useEffect, useState } from "react";
import { useProvider } from "./useProvider";

import Exchange from "@/app/abis/Exchange.json"
import config from "@/app/config.json"
import { ethers } from "ethers";

export function useExchange() {
    const { provider, chainId } = useProvider();
    const [exchange, setExchnage] = useState(null);


    useEffect(() => {
        if (provider) {
            if (!config[Number(chainId)]) return;
            const exchangeContract = new ethers.Contract(config[Number(chainId)].exchange, Exchange, provider);
            setExchnage(exchangeContract);
        }
    }, [provider])

    return { exchange }
}
