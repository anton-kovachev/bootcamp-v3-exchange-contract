"use client";

import { loans } from "@/app/data/loans";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useProvider } from "../hooks/useProvider";
import { useExchange } from "../hooks/useExchange";
import {
  setFlashLoans,
  addNewFlashLoan,
} from "@/lib/features/exchange/exchange";

import { selectFlashLoans } from "@/lib/selectors";

import Loans from "../components/Loans";
import moment from "moment";

export default function Home() {
  const { provider } = useProvider();
  const { exchange } = useExchange();

  const dispatch = useAppDispatch();
  const flashLoans = useAppSelector(selectFlashLoans);

  useEffect(() => {
    if (provider && exchange) {
      fetchFlashLoans();

      exchange.on("FlashLoan", (token, amount, timestamp) => {
        dispatch(
          addNewFlashLoan({
            token,
            amount: amount.toString(),
            timestamp: timestamp.toString(),
          })
        );
      });

      return () => exchange.off("FlashLoan");
    }
  }, [provider, exchange]);

  async function fetchFlashLoans() {
    const blockNumber = await provider.getBlockNumber();
    const loansStream = await exchange.queryFilter("FlashLoan", 0, blockNumber);
    dispatch(
      setFlashLoans(
        loansStream.map(({ args: { token, amount, timestamp } }) => ({
          token,
          amount: amount.toString(),
          timestamp: timestamp.toString(),
        }))
      )
    );
  }

  return (
    <div className="page loans">
      <h1 className="title">Loans</h1>
      {flashLoans?.length > 0 ? (
        <section className="data">
          <Loans loans={flashLoans} />
        </section>
      ) : (
        <p className="center">No Transactions</p>
      )}
    </div>
  );
}
