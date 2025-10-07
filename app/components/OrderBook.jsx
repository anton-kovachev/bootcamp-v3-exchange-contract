"use client";

import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setOrderToFill } from "@/lib/features/exchange/exchange";
import { selectOpenOrdersFromMarket } from "@/lib/selectors";

export default function OrderBook({ caption, market, orders }) {
  const formatAamount = (amount) => ethers.formatUnits(amount, 18);

  const dispatch = useAppDispatch();
  const openOrdersFromMarket = useAppSelector(selectOpenOrdersFromMarket);
  const router = useRouter();

  function selectOrderHandler(order) {
    if (order) {
      dispatch(setOrderToFill(order));
      router.push("/swap");
    }
  }

  return (
    <div className="table-wrapper">
      {market?.length && (
        <table>
          <caption>{caption}</caption>
          <thead>
            <tr>
              <th>
                {(caption === "Selling"
                  ? market[1]?.symbol
                  : market[0]?.symbol) ?? "N/A"}
              </th>
              <th>{`${market[0]?.symbol ?? "N/A"}/${
                market[1]?.symbol ?? "N/A"
              }`}</th>
              <th>
                {(caption === "Selling"
                  ? market[0]?.symbol
                  : market[1].symbol) ?? "N/A"}
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order, index) => (
              <tr
                key={index}
                role="link"
                tabIndex={0}
                aria-label="Fill Order"
                onClick={(e) => selectOrderHandler(order)}
              >
                <td className={caption == "Selling" ? "gray" : undefined}>
                  {formatAamount(order.amountGet)}
                </td>
                <td className={order.type === "buy" ? "green" : "red"}>
                  {order.price}
                </td>
                <td className={caption === "Buying" ? "gray" : undefined}>
                  {formatAamount(order.amountGive)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
