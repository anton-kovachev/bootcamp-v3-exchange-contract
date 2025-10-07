"use client";

import { ethers } from "ethers";

export default function Loans({ loans }) {
  console.log("Loans");
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Token</th>
            <th>Time</th>
            <th>Amount</th>
          </tr>
        </thead>

        <tbody>
          {loans.map((x, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                {x.token.slice(0, 6) +
                  "..." +
                  x.token.slice(x.token.length - 4)}
              </td>
              <td>{x.date}</td>
              <td>{ethers.formatUnits(x.amount, 18)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
