import { get } from "lodash";
import { createSelector } from "reselect";

export const selectAccount = state => get(state, "user.account", null);
export const selectETHBalance = state => get(state, "user.balance", null);
export const selectTokens = state => get(state, "tokens.tokens", []);
export const selectTokenBalances = state => get(state, "tokens.balances", {});

export const selectWalletBalances = createSelector(
    selectTokens,
    selectTokenBalances,
    (tokens, balances) => {
        return tokens.map(({ symbol, address }) => ({ symbol, wallet: balances[address]?.wallet ?? 0 }));
    });

export const selectExchangeBalances = createSelector(
    selectTokens,
    selectTokenBalances,
    (tokens, balances) => {
        const exchangeBalance = balances[tokens.address]?.exchange ?? 0;
        return tokens.map(({ symbol }) => ({ symbol, exchange: exchangeBalance }));
    });
