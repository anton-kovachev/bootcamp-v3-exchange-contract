"use client";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import { useProvider } from "../hooks/useProvider";
import { useTokens } from "../hooks/useTokens";
import { useAppDispatch } from "@/lib/hooks";
import { setMarket } from "@/lib/features/exchange/exchange";
import { selectMarket } from "@/lib/selectors";
import config from "@/app/config.json";
import { chain } from "lodash";

export default function Market() {
  const { tokens: tokenContracts } = useTokens();
  const { chainId } = useProvider();
  const [marketPairs, setMarketPairs] = useState([]);
  const dispatch = useAppDispatch();
  const selectedMarket = useAppSelector(selectMarket);

  useEffect(() => {
    if (chainId) getMarketPairs();
  }, [chainId]);

  useEffect(() => {
    if (config[Number(chainId)]?.markets[0]?.tokens && tokenContracts) {
      marketHandler(config[Number(chainId)].markets[0].tokens);
    }
  }, [chainId, tokenContracts]);

  function getMarketPairs() {
    const marketPairs =
      config[Number(chainId)]?.markets.map(({ name, tokens }) => ({
        id: `${tokens[0]},${tokens[1]}`,
        name,
      })) ?? [];

    setMarketPairs(marketPairs);
  }

  async function marketHandler(tokenAddresses) {
    const promises = await tokenAddresses.map(async (address) => {
      const symbol = tokenContracts[address]
        ? await tokenContracts[address]?.symbol()
        : "N/A";

      return { address, symbol };
    });

    const selectedMarket = await Promise.all(promises);
    dispatch(setMarket(selectedMarket));
  }

  return (
    <div className="select">
      <select
        name="market"
        id="market"
        defaultValue={marketPairs?.length ? marketPairs[0].id : 0}
        disabled={!marketPairs?.length}
        onChange={(e) => marketHandler(e.target.value.split(","))}
      >
        <option value={0} disabled>
          {marketPairs?.length ? "Select Market" : "No Markets Available"}
        </option>

        {marketPairs.map((x) => (
          <option key={x.id} value={x.id}>
            {x.name}
          </option>
        ))}
      </select>
    </div>
  );
}
