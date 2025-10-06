"use client";
import { ethers } from "ethers";
import { useProvider } from "../hooks/useProvider";
import { useExchange } from "../hooks/useExchange";

export default function Orders({ market, orders, type }) {
  const { provider } = useProvider();
  const { exchange } = useExchange();

  async function cancelHandler(order) {
    try {
      debugger;
      const signer = await provider.getSigner();

      const transaction = await exchange.connect(signer).cancelOrder(order.id);
      await transaction.wait();
    } catch (e) {
      console.log("Order cancel failed ", e);
    }
  }

  return (
    <div className="table-wrapper">
      {market && orders?.length ? (
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>{market[0].symbol}</th>
              <th>{`${market[0].symbol}/${market[1].symbol}`}</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((x, index) => (
              <tr
                key={index}
                onClick={type === "open" && (() => cancelHandler(x))}
                role={type === "open" ? "link" : undefined}
                tabIndex={type === "open" ? 0 : -1}
                aria-label={type === "open" ? "Fill Order" : undefined}
                className={type === "open" ? "hover-red" : undefined}
              >
                <td>{x.date}</td>
                <td className={x.type === "buy" ? "green" : "red"}>
                  {x.type == "buy"
                    ? `+${ethers.formatUnits(x.amountGet, 18)}`
                    : `-${ethers.formatUnits(x.amountGive, 18)}`}
                </td>
                <td className="red">{x.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No Orders</p>
      )}
    </div>
  );
}
