import { get } from "lodash";
import { createSelector } from "reselect";

export const selectAccount = (state) => get(state, "user.account", null);
export const selectETHBalance = (state) => get(state, "user.balance", null);
export const selectTokens = (state) => get(state, "tokens.tokens", []);
export const selectTokenBalances = (state) => get(state, "tokens.balances", {});
export const selectMarket = (state) => get(state, "exchange.market", []);

export const selectWalletBalances = createSelector(
    selectTokens,
    selectTokenBalances,
    (tokens, balances) => {
        return tokens.map(({ symbol, address }) => ({
            symbol,
            wallet: balances[address]?.wallet ?? 0,
        }));
    }
);

export const selectExchangeBalances = createSelector(
    selectTokens,
    selectTokenBalances,
    (tokens, balances) => {
        const exchangeBalance = balances[tokens.address]?.exchange ?? 0;
        return tokens.map(({ symbol, address }) => ({ symbol, exchange: balances[address]?.exchange ?? 0 }));
    }
);

export const selectTokenAndBalance = createSelector(
    selectTokens,
    selectTokenBalances,
    (state, address) => address,
    (tokens, balances, address) => {
        const token = tokens.find(x => x.address === address);
        return { token, balances: { wallet: balances[address]?.wallet ?? 0, exchange: balances[address]?.exchange ?? 0 } }
    }
);

// export const selectMarketPair = createSelector(
//     selectMarket,
//     (state, id) => (id),
//     (market, id) => {
//         debugger;
//         const m = market.find((x) => x.id === id) ?? {};
//         return m;
//     }
// );
