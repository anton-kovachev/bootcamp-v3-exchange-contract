import Image from "next/image";
import dapp from "@/app/assets/tokens/dapp.svg";
// import eth from "@app/assets/tokens/eth.svg";

export function Balances({ balances }) {
  return (
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Token</th>
          <th>Balance</th>
        </tr>
      </thead>
      <tbody>
        {balances.map(({ symbol, balance }, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td className="flex">
              <Image src={dapp} alt={symbol} width={25} height={25} />
              {symbol}
            </td>
            <td>{balance}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
