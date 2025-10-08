const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const {
  deployExchangeFixture,
  depositExchangeFixture,
} = require("./Helpers/ExchangeFixtures");
const { tokens } = require("./Helpers/TokenFixtures");

async function flashLoanFixture() {
  const {
    tokens,
    exchange,
    accounts: { user1 },
    accounts,
  } = await loadFixture(depositExchangeFixture);

  const FlashLoanUser = await ethers.getContractFactory("FlashLoanUser");
  const flashLoanUser = await FlashLoanUser.connect(user1).deploy(
    await exchange.getAddress()
  );

  return { tokens, exchange, accounts, flashLoanUser };
}

describe("FlashLoanProvider", () => {
  describe("Calling flashLoan from FlashLoan user", () => {
    describe("Success", () => {
      it("emits a Flash Loan event", async () => {
        const {
          tokens: { token0 },
          exchange,
          accounts: { user1 },
          flashLoanUser,
        } = await loadFixture(flashLoanFixture);
        const AMOUNT = tokens(100);

        const transaction = await flashLoanUser
          .connect(user1)
          .getFlashLoan(await token0.getAddress(), AMOUNT);
        await transaction.wait();
        const { timestamp } = await ethers.provider.getBlock();
        await expect(transaction)
          .to.emit(exchange, "FlashLoan")
          .withArgs(await token0.getAddress(), AMOUNT, timestamp);
      });

      it("emits a Flash Loan event", async () => {
        const {
          tokens: { token0 },
          exchange,
          accounts: { user1 },
          flashLoanUser,
        } = await loadFixture(flashLoanFixture);
        const AMOUNT = tokens(100);

        const transaction = await flashLoanUser
          .connect(user1)
          .getFlashLoan(await token0.getAddress(), AMOUNT);
        await transaction.wait();
        const { timestamp } = await ethers.provider.getBlock();
        await expect(transaction)
          .to.emit(flashLoanUser, "FlashLoanReceived")
          .withArgs(
            await flashLoanUser.getAddress(),
            await token0.getAddress(),
            AMOUNT
          );
      });
    });

    describe("Failure", () => {
      it("fails due to insufficient amount", async () => {
        const {
          tokens: { token0 },
          accounts: { user1 },
          flashLoanUser,
        } = await loadFixture(flashLoanFixture);
        const AMOUNT = tokens(1000);

        const transaction = flashLoanUser
          .connect(user1)
          .getFlashLoan(await token0.getAddress(), AMOUNT);
        await expect(transaction).to.be.revertedWith(
          "FlashLoanProvider: Insufficient funds to loan."
        );
      });

      // it("fails due to not the owner", async () => {
      //     const { tokens: { token0 }, accounts: { user2 }, flashLoanUser } = await loadFixture(flashLoanFixture);
      //     const AMOUNT = tokens(100);

      //     const transaction = flashLoanUser.connect(user2).getFlashLoan(await token0.getAddress(), AMOUNT);
      //     await expect(transaction).to.be.revertedWith("FlashLoanUser: Only owner can request flash loans")
      // })

      it("fails due to be called from a malicious user", async () => {
        const {
          tokens: { token0 },
          accounts: { user2 },
          flashLoanUser,
        } = await loadFixture(flashLoanFixture);
        const AMOUNT = tokens(100);

        const transaction = flashLoanUser
          .connect(user2)
          .receiveFlashLoan(await token0.getAddress(), AMOUNT, "0x");
        await expect(transaction).to.be.revertedWith(
          "FlashLoanUser: Not Exchange contract"
        );
      });
    });
  });
});
