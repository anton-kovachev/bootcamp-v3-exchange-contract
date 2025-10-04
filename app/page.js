
"use client"

import { ethers } from "ethers";
import { useEffect, useRef, useState } from "react";

import Market from "./components/Market";
import OrderBook from "./components/OrderBook";
import Orders from "./components/Orders";
import Tabs from "./components/Tabs";
import Chart from "./components/Chart"


export default function Home() {
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

    <section className="ordebook">
      <h2>Order Book</h2>
      <OrderBook />
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