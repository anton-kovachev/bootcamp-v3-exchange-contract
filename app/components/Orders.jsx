"use client";
import { ethers } from "ethers";

export default function Orders({ market, orders, type }) {
  return (
    <div className="table-wrapper">
      {market && orders?.length ? (
        <table>
          <caption>Trades</caption>
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
                role={type === "open" ? "link" : undefined}
                tabIndex={type === "open" ? 0 : -1}
                aria-label={type === "open" ? "Fill Order" : undefined}
                className={type === "open" ? "hover-red" : undefined}
              >
                <td>{x.date}</td>
                <td className={x.type === "buy" ? "green" : "red"}>
                  {x.type == "buy"
                    ? +ethers.formatUnits(x.amountGet, 18)
                    : -ethers.formatUnits(x.amountGive, 18)}
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
