"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ethers } from "ethers";

import Chart from "@/app/components/Chart";

import arrow from "@/app/assets/arrows/arrow-down.svg";
import mask from "@/app/assets/mask.svg";

import {
  selectOrderToFill,
  selectMarket,
  selectPriceData,
} from "@/lib/selectors";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";

import { useProvider } from "../hooks/useProvider";
import { useExchange } from "../hooks/useExchange";
import { setOrderToFill } from "@/lib/features/exchange/exchange";

export default function Home() {
  const orderToFill = useAppSelector(selectOrderToFill);
  const selectedMarket = useAppSelector(selectMarket);
  const marketPriceData = useAppSelector(selectPriceData);

  const { provider } = useProvider();
  const { exchange } = useExchange();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [gasFee, setGasFee] = useState(0);

  async function estimateFees() {
    const { maxFeePerGas } = await provider.getFeeData();
    const gasUsage = await exchange.fillOrder.estimateGas(orderToFill.id);

    setGasFee(gasUsage * maxFeePerGas);
  }

  useEffect(() => {
    if (provider && exchange && orderToFill) {
      estimateFees();
    }
  }, [provider, exchange, orderToFill]);

  async function fillOrderHandler() {
    if (orderToFill) {
      try {
        const signer = await provider.getSigner();
        const transaction = await exchange
          .connect(signer)
          .fillOrder(orderToFill.id);
        const receipt = await transaction.wait();
        dispatch(setOrderToFill(null));
        router.push("/");
      } catch (e) {
        console.log("Error ", e);
      }
    }
  }

  async function cancelFillOrderHandler() {
    dispatch(setOrderToFill(null));
  }

  console.log("Order to fill: ", orderToFill);
  return (
    <div className="page swapping">
      <h1 className="title">Swap</h1>

      {orderToFill && selectedMarket && (
        <>
          <section className="swap">
            <form action={fillOrderHandler}>
              <div className="inputs">
                <div className="input">
                  <label htmlFor="sell">Sell</label>

                  <input
                    type="number"
                    value={ethers.formatUnits(orderToFill.amountGet, 18)}
                    disabled
                  />

                  <div className="select">
                    <select name="sell" id="sell" disabled>
                      <option
                        value={
                          orderToFill.type === "buy"
                            ? selectedMarket[0].address
                            : selectedMarket[1].address
                        }
                      >
                        {orderToFill.type === "buy"
                          ? selectedMarket[0].symbol
                          : selectedMarket[1].symbol}
                      </option>
                    </select>
                  </div>
                </div>

                <div className="arrow">
                  <Image src={arrow} alt="Arrow down" />
                </div>

                <div className="input">
                  <label htmlFor="">Buy</label>
                  <input
                    type="number"
                    value={ethers.formatUnits(orderToFill.amountGive, 18)}
                    disabled
                  />

                  <div className="select">
                    <select name="buy" id="buy" disabled>
                      <option
                        value={
                          orderToFill.type === "buy"
                            ? selectedMarket[1].address
                            : selectedMarket[0].address
                        }
                      >
                        {orderToFill.type === "buy"
                          ? selectedMarket[1].symbol
                          : selectedMarket[0].symbol}
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <input type="submit" />
            </form>
            <br />
            <div className="fees">
              <div className="fee">
                <p>Gas Fee</p>
                <p>{Number(ethers.formatUnits(gasFee, 18)).toFixed(5)}</p>
              </div>
              <div className="fee">
                <p>Swap Fee</p>
                <p>0.00125 ETH</p>
              </div>
              <div className="fee">
                <p>Amount Received</p>
                <p>
                  {ethers.formatUnits(orderToFill.amountGive, 18)}{" "}
                  {orderToFill.type === "buy"
                    ? selectedMarket[1].symbol
                    : selectedMarket[0].symbol}
                </p>
              </div>
            </div>
            <br />
            <div className="cancel-container">
              <Link
                href="/"
                className="cancel"
                onClick={cancelFillOrderHandler}
              >
                Cancel Swap
              </Link>
            </div>
          </section>

          {orderToFill && selectedMarket?.length && marketPriceData && (
            <section className="insights">
              <Chart market={selectedMarket} data={marketPriceData} />
            </section>
          )}
        </>
      )}

      {!orderToFill && (
        <section className="placeholder">
          <Image src={mask} alt="Swap Logo" />
          <h2>Please select an order to fill</h2>
          <Link href="/" className="button">
            Select now
          </Link>
        </section>
      )}
    </div>
  );
}
