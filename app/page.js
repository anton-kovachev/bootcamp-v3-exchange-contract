
"use client"

import { ethers } from "ethers";
import { useEffect, useRef, useState } from "react";

import Market from "./components/Market";
import OrderBook from "./components/OrderBook";
import Orders from "./components/Orders";
import Tabs from "./components/Tabs";
import Chart from "./components/Chart"

import { useAppSelector } from "@/lib/hooks";
import { useAppDispatch } from "@/lib/hooks";
import { selectMarket, selectAllOrders, selectOpenOrders } from "@/lib/selectors";
import { setAllOrders, setCancelledOrders, setFilledOrders } from "@/lib/features/exchange/exchange";

import { openOrders, myOpenOrders, filledOrders, myFilledOrders } from "./data/orders";
import { useExchange } from "./hooks/useExchange";
import { useProvider } from "./hooks/useProvider";

import config from "@/app/config.json"


export default function Home() {
  const { provider } = useProvider();
  const { exchange } = useExchange();

  const dispatch = useAppDispatch();
  const selectedMarket = useAppSelector(selectMarket);
  const openedOrders = useAppSelector(selectOpenOrders);

  useEffect(() => {
    if (provider && exchange && selectedMarket) {
      exchange.filters.OrderCreated()
      getAllOrders();
    }
  }, [provider, exchange, selectedMarket]);


  async function getAllOrders() {
    const block = await provider.getBlockNumber();
    const orderStream = await exchange.queryFilter('OrderCreated', 0, block);
    const allOrders = orderStream.map((x) => (x.args));
    dispatch(setAllOrders(serializeOrders(allOrders)))

    // const cancelledOrdersStream = await exchange.queryFilter("OrderCancelled", 0, block);
    // const cancelledOrders = cancelledOrdersStream.map((x) => (x.args));
    // dispatch(setCancelledOrders(serializeOrders(cancelledOrders)))

    const filledOrdersStream = await exchange.queryFilter("OrderFilled", 0, block);
    const filledOrders = filledOrdersStream.map((x) => (x.args));
    dispatch(setFilledOrders(serializeOrders(filledOrders)))
  }

  function serializeOrders(orders) {
    debugger
    console.log("Orders ", orders);
    let serializedOrders = [];
    orders.forEach((x) => {
      serializedOrders[Number(x.id) - 1] = {
        id: x.id.toString(),
        user: x.user,
        tokenGet: x.tokenGet,
        amountGet: x.amountGet.toString(),
        tokenGive: x.tokenGive,
        amountGive: x.amountGive.toString(),
        timestamp: x.timestamp.toString()
      }
    })

    return serializedOrders;
  }

  return (<div className="page trading">
    <h1 className="title">Trading</h1>

    <section className="insights">
      <Chart />
    </section>

    <section className="market">
      <h2>Select Market</h2>

      <Market />
    </section>

    <section className="order">
      <h2>New Order</h2>

      <Tabs />

      <form></form>
    </section>

    <section className="orderbook">
      <h2>Order Book</h2>
      {selectMarket ?
        (<>
          <OrderBook caption="Selling" market={selectedMarket} orders={openedOrders.sellOrders} />
          <OrderBook caption="Buying" market={selectedMarket} orders={openedOrders.buyOrders} /></>
        ) :
        (<p>Please select a market</p>)}
    </section>

    <section className="orders">
      <h2>My Trads</h2>
      <Orders />
    </section>

    <section className="transactions">
      <h2>Trades</h2>
      <Orders />
    </section>
  </div>)
}