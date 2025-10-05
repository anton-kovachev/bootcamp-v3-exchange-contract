"use client";

import dynamic from "next/dynamic";
import Image from "next/image";

const Chart = dynamic(() => import("react-apexcharts", { ssr: false }));

import { options, series } from "../data/prices";

import up from "@/app/assets/arrows/price-up.svg";
import down from "@/app/assets/arrows/price-down.svg";

export default function PriceChart({ market, data }) {
  return (
    <div className="chart">
      <div className="flex-between">
        <div className="stats">
          <p className="price">
            <small>{`${market[0].symbol}\\${market[1].symbol}`}</small> &nbsp;{" "}
            <Image
              src={data.lastPriceChange === "+" ? up : down}
              alt={data.lastPriceChange === "+" ? "Up" : "Down"}
              width={30}
              height={30}
            />
            &nbsp; {data.lastPrice}
          </p>
        </div>

        <div className="select">
          <select className="select" name="time" id="time">
            <option value="0">Last Week</option>
            <option value="1">Last Month</option>
            <option value="2">Last Year</option>
          </select>
        </div>
      </div>
      <Chart
        options={options}
        series={data.series}
        type="candlestick"
        width="100%"
        height="100%"
      />
    </div>
  );
}
