import { verifyTypedData } from "ethers";
import _ from "lodash";
import moment from "moment";
import { createSelector } from "reselect";

export const selectAccount = (state) => _.get(state, "user.account", null);
export const selectETHBalance = (state) => _.get(state, "user.balance", null);
export const selectTokens = (state) => _.get(state, "tokens.tokens", []);
export const selectTokenBalances = (state) =>
  _.get(state, "tokens.balances", {});

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
    return tokens.map(({ symbol, address }) => ({
      symbol,
      exchange: balances[address]?.exchange ?? 0,
    }));
  }
);

export const selectTokenAndBalance = createSelector(
  selectTokens,
  selectTokenBalances,
  (state, address) => address,
  (tokens, balances, address) => {
    const token = tokens.find((x) => x.address === address);
    return {
      token,
      balances: {
        wallet: balances[address]?.wallet ?? 0,
        exchange: balances[address]?.exchange ?? 0,
      },
    };
  }
);

export const selectMarket = (state) => _.get(state, "exchange.market", []);
export const selectAllOrders = (state) =>
  _.get(state, "exchange.allOrders", []);
export const selectCancelledOrders = (state) =>
  _.get(state, "exchange.cancelledOrders", []);
export const selectFilledOrders = (state) =>
  _.get(state, "exchange.filledOrders", []);
export const selectOrderToFill = (state) =>
  _.get(state, "exchange.orderToFill", null);

export const selectAllOpenOrders = createSelector(
  selectAllOrders,
  selectCancelledOrders,
  selectFilledOrders,
  (allOrders, cancelledOrders, filledOrders) => {
    return _.reject(allOrders, (x) => {
      const filledOrder = filledOrders.some(
        (fo) => fo.id.toString() === x.id.toString()
      );
      const cancelledOrder = cancelledOrders.some(
        (co) => co.id.toString() === x.id.toString()
      );

      return filledOrder || cancelledOrder;
    });
  }
);

const decorateOrders = (orders, market) => {
  return orders.map((x) => {
    const type = x.tokenGet === market[0].address ? "buy" : "sell";
    const precision = 100000;
    const price = ((x.amountGive / x.amountGet) * precision) / precision;
    const date = moment.unix(x.timestamp).format("D MMM YY hh:mm:ss");
    return { ...x, type, price, date };
  });
};

export const selectOpenOrdersFromMarket = createSelector(
  selectAllOpenOrders,
  selectMarket,
  (orders, market) => {
    if (!market) return { orders: [], buyOrders: [], sellOrders: [] };

    orders = orders.filter(
      (x) =>
        x.tokenGet === market[0].address || x.tokenGet === market[1].address
    );
    orders = orders.filter(
      (x) =>
        x.tokenGive === market[0].address || x.tokenGive === market[1].address
    );

    orders = decorateOrders(orders, market);
    const grouped_orders = _.groupBy(orders, "type");
    return {
      orders,
      buyOrders: _.get(grouped_orders, "buy", []),
      sellOrders: _.get(grouped_orders, "sell", []),
    };
  }
);

export const selectFilledOrdersFromMarket = createSelector(
  selectFilledOrders,
  selectMarket,
  (filledOrders, market) => {
    filledOrders = filledOrders.filter(
      (x) =>
        x.tokenGet === market[0].address || x.tokenGet === market[1].address
    );
    filledOrders = filledOrders.filter(
      (x) =>
        x.tokenGive === market[0].address || x.tokenGive === market[1].address
    );
    return decorateOrders(filledOrders, market);
  }
);

export const selectAccountOpenOrders = createSelector(
  selectAccount,
  selectOpenOrdersFromMarket,
  (account, openOrders) => {
    const accountOrders = _.reject(openOrders.orders, (x) => x.user != account);
    return accountOrders;
  }
);

export const selectAccountFilledOrders = createSelector(
  selectAccount,
  selectFilledOrdersFromMarket,
  (account, filledOrders) => {
    const accountFilledOrders = _.reject(
      filledOrders,
      (x) => x.user != account
    );
    return accountFilledOrders;
  }
);

export const selectPriceData = createSelector(
  selectFilledOrdersFromMarket,
  (orders) => {
    const sortedOrders = orders.sort((a, b) => a.timestamp - b.timestamp);
    const [secondLastOrder, lastOrder] = sortedOrders.slice(
      sortedOrders.length - 2
    );

    const lastPrice = _.get(lastOrder, "price", 0);
    const secondLastPrice = _.get(secondLastOrder, "price", 0);
    const graphData = buildGraphData(sortedOrders);

    return {
      lastPrice,
      lastPriceChange: lastPrice >= secondLastPrice ? "+" : "-",
      series: [{ data: graphData }],
    };
  }
);

const buildGraphData = (orders) => {
  orders = _.groupBy(orders, (x) =>
    moment.unix(x.timestamp).startOf("hour").format()
  );
  const hours = Object.keys(orders);

  const graphData = hours.map((x) => {
    const openPrice = orders[x][0].price;
    const closePrice = orders[x][orders[x].length - 1].price;

    const highPrice = _.maxBy(orders[x], "price")?.price ?? 0;
    const lowPrice = _.minBy(orders[x], "price")?.price ?? 0;

    return { x: new Date(x), y: [openPrice, highPrice, lowPrice, closePrice] };
  });

  return graphData;
};
