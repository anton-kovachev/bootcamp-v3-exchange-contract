"use client"

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useTokens } from "../hooks/useTokens";
import { useExchange } from "../hooks/useExchange";
import { selectAccount, selectTokens, selectWalletBalances, selectExchangeBalances } from "@/lib/selectors";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setTokens, setBalance } from "@/lib/features/tokens/tokens";
import { Balances } from "../components/Balances";

export default function Home() {
    const { tokens: tokenContracts } = useTokens();
    const { exchange } = useExchange();
    const dispatch = useAppDispatch();
    const account = useAppSelector(selectAccount);
    const tokens = useAppSelector(selectTokens);
    const walletBalances = useAppSelector(selectWalletBalances);
    const exchangeBalances = useAppSelector(selectExchangeBalances);

    const getBalances = async () => {
        debugger
        Object.entries(tokenContracts).forEach(async ([tokenAddress, token], index) => {
            const symbol = await token.symbol();
            const walletBalance = await token.balanceOf(account);
            debugger;
            const exchangeBalance = await exchange.totalBalanceOf(account, tokenAddress);
            dispatch(setTokens({ index, address: tokenAddress, symbol }));
            dispatch(setBalance({ address: tokenAddress, wallet: ethers.formatUnits(walletBalance, 18), exchange: ethers.formatUnits(exchangeBalance, 18) }));
        })
    }

    useEffect(() => {
        debugger
        if (tokenContracts && exchange && account)
            getBalances();
    }, [tokenContracts, exchange, account]);

    return (<div className="page wallet">
        {console.log(walletBalances)}
        <h1 className="title">Wallet</h1>
        <section>
            <h2>Wallet Funds</h2>
            {walletBalances?.length ? <Balances balances={walletBalances.map(({ symbol, wallet }) => ({ symbol, balance: wallet }))} /> : <>No Balances Available</>}
        </section>
        <section>
            <h2>Exchange Funds</h2>
            {exchangeBalances?.length ? <Balances balances={exchangeBalances.map(({ symbol, exchange }) => ({ symbol, balance: exchange }))} /> : <>No Balances Available</>}
        </section>
        <section className="deposit">
            <h2>Deposit</h2>
        </section>
        <section className="withdraw">
            <h2>Withdraw</h2>
        </section>
    </div>);
}