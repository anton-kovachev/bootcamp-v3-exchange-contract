import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAppSelector } from "@/lib/hooks";
import { selectTokenAndBalance } from "@/lib/selectors";
import { useProvider } from "../hooks/useProvider";
import { useExchange } from "../hooks/useExchange";
import { useTokens } from "../hooks/useTokens";
import { useAppDispatch } from "@/lib/hooks";
import { setBalance } from "@/lib/features/tokens/tokens";

export default function Transfer({ type, tokens }) {
  const [selectedTokenAddress, setSelectedTokenAddress] = useState(null);
  const { provider } = useProvider();
  const { tokens: tokenContracts } = useTokens();
  const { exchange } = useExchange();
  const dispatch = useAppDispatch();

  const tokenAndBalances = useAppSelector((state) =>
    selectTokenAndBalance(state, selectedTokenAddress)
  );

  const tokenHandler = (e) => setSelectedTokenAddress(e.target.value);

  async function transferHandler(form) {
    try {
      const signer = await provider.getSigner();
      const address = form.get("token");
      const amount = form.get("amount");
      const amountWei = ethers.parseUnits(amount, 18);

      if (type === "deposit") {
        await approve(signer, address, amountWei);
        await deposit(signer, address, amountWei);
      } else if (type === "withdraw") {
        const transaction = await exchange
          .connect(signer)
          .withdrawToken(address, amountWei);
        await transaction.wait();
      }
      await getBalance(signer, address);
    } catch (error) {
      console.log(error);
    }
  }

  async function approve(signer, address, amountWei) {
    const token = tokenContracts[address];
    if (token) {
      const transaction = await token
        .connect(signer)
        .approve(await exchange.getAddress(), amountWei);
      await transaction.wait();
    }
  }

  async function deposit(signer, address, amountWei) {
    const transaction = await exchange
      .connect(signer)
      .depositToken(address, amountWei);
    await transaction.wait();
  }

  async function getBalance(signer, address) {
    const walletBalance = await tokenContracts[address].balanceOf(
      await signer.getAddress()
    );
    const exchangeBalance = await exchange.totalBalanceOf(
      await signer.getAddress(),
      address
    );

    dispatch(
      setBalance({
        address,
        wallet: ethers.formatUnits(walletBalance, 18),
        exchange: ethers.formatUnits(exchangeBalance, 18),
      })
    );
  }

  function canSubmit() {
    if (type === "deposit") {
      return selectedTokenAddress && tokenAndBalances?.balances?.wallet;
    } else {
      return selectedTokenAddress && tokenAndBalances?.balances?.exchange;
    }
  }

  return (
    <form action={transferHandler}>
      <div className="token">
        <label htmlFor={`${type}-token`}>Select Token</label>

        <div className="select">
          <select
            name="token"
            id={`${type}-token`}
            value={selectedTokenAddress ?? 0}
            disabled={!tokens?.length}
            onChange={tokenHandler}
          >
            <option value={0} disabled>
              Select Token
            </option>
            {tokens.map((x) => (
              <option key={x.symbol} value={x.address}>
                {x.symbol}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="amount">
        <label htmlFor={`${type}-amount`}>Amount</label>{" "}
        <input
          type="number"
          name="amount"
          id="amount"
          placeholder="0.000"
          min="0"
          max={
            type == "deposit"
              ? tokenAndBalances?.balances?.wallet ?? 0
              : tokenAndBalances?.balances?.exchange ?? 0
          }
        />
      </div>

      <div className="info">
        <div>
          <p>Token</p>
          <p>{tokenAndBalances?.token?.symbol ?? "N/A"}</p>
        </div>
        <div>
          <p>Wallet</p>
          <p>{tokenAndBalances?.balances?.wallet ?? 0}</p>
        </div>
        <div>
          <p>Exchange</p>
          <p>{tokenAndBalances?.balances?.exchange ?? 0}</p>
        </div>
      </div>

      <input type="submit" value={type} disabled={!canSubmit()} />
    </form>
  );
}
