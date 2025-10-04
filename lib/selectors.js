import { verifyTypedData } from "ethers";
import _, { get, reject } from "lodash";
import moment from "moment";
import { createSelector } from "reselect";

export const selectAccount = (state) => get(state, "user.account", null);
export const selectETHBalance = (state) => get(state, "user.balance", null);
export const selectTokens = (state) => get(state, "tokens.tokens", []);
export const selectTokenBalances = (state) => get(state, "tokens.balances", {});

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

export const selectMarket = (state) => get(state, "exchange.market", []);
export const selectAllOrders = (state) => get(state, "exchange.allOrders", []);
export const selectCancelledOrders = (state) => get(state, "exchange.cancelledOrders", []);
export const selectFilledOrders = (state) => get(state, "exchange.filledOrders", []);
export const selectAllOpenOrders = createSelector(selectAllOrders, selectCancelledOrders, selectFilledOrders, (allOrders, cancelledOrders, filledOrders) => {
    return reject(allOrders, (x) => {
        const filledOrder = filledOrders.some(fo => (fo.id.toString() === x.id.toString()));
        const cancelledOrder = cancelledOrders.some(co => (co.id.toString() === x.id.toString()));

        return filledOrder || cancelledOrder;
    });
})

const decorateOrders = (orders, market) => {
    return orders.map(x => {
        const type = x.tokenGet === market[0].address ? "buy" : "sell";
        const precision = 100000;
        const price = ((x.amountGive / x.amountGet) * precision) / precision;
        const date = moment.unix(x.timestamp).format("D MMM YY hh:mm:ss")
        return { ...x, type, price, date };
    });

}

export const selectOpenOrders = createSelector(selectAllOpenOrders, selectMarket, (orders, market) => {
    if (!market)
        return { orders: [], buyOrders: [], sellOrders: [] };

    orders = orders.filter((x) => x.tokenGet === market[0].address || x.tokenGet === market[1].address);
    orders = orders.filter((x) => x.tokenGive === market[0].address || x.tokenGive === market[1].address);

    orders = decorateOrders(orders, market);
    orders = _.groupBy(orders, "type");
    return { orders, buyOrders: _.get(orders, "buy", []), sellOrders: _.get(orders, "sell", []) };
})

export const selectDecoratedFilledOrders = createSelector(selectFilledOrders, selectMarket, (filledOrders, market) => {
    filledOrders = filledOrders.filter((x) => x.tokenGet === market[0].address || x.tokenGet === market[1].address);
    filledOrders = filledOrders.filter((x) => x.tokenGive === market[0].address || x.tokenGive === market[1].address);
    return decorateOrders(filledOrders, market);
});