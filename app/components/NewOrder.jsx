import { ethers } from "ethers";

export default function NewOrder({ type, market, provider, exchange }) {
  async function orderHandler(form) {
    try {
      debugger;
      const amount = form.get("amount");
      const price = form.get("price");

      if (!amount || !price) return;

      const tokenGet = type === "buy" ? market[0].address : market[1].address;
      const tokenGive = type === "buy" ? market[1].address : market[0].address;

      const amountGetWei =
        type === "buy"
          ? ethers.parseUnits(amount.toString(), 18)
          : ethers.parseUnits((amount * price).toString(), 18);
      const amountGiveWei =
        type === "buy"
          ? ethers.parseUnits((amount * price).toString(), 18)
          : ethers.parseUnits(amount.toString(), 18);

      await makeOrder(tokenGet, amountGetWei, tokenGive, amountGiveWei);
    } catch (e) {
      console.log("Create Order failed with: ", e);
    }
  }

  async function makeOrder(tokenGet, amountGetWei, tokenGive, amountGiveWei) {
    const signer = await provider.getSigner();
    const trasnaction = await exchange
      .connect(signer)
      .makeOrder(tokenGet, amountGetWei, tokenGive, amountGiveWei);
    const receipt = await trasnaction.wait();
  }

  return (
    <form action={orderHandler}>
      <label htmlFor="amount">{type === "buy" ? "Buy" : "Sell"} Amount</label>
      <input
        type="number"
        name="amount"
        id="amount"
        placeholder="0.0000"
        step="0.0001"
      />

      <label htmlFor="price">{type === "buy" ? "Buy" : "Sell"} Price</label>
      <input
        type="number"
        name="price"
        id="price"
        placeholder="0.0000"
        step="0.0001"
      />

      <input
        type="submit"
        value={`Create ${type === "buy" ? "Buy" : "Sell"} Order`}
      />
    </form>
  );
}
