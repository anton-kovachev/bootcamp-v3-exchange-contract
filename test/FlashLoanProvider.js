const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const { deployExchangeFixture, depositExchangeFixture } = require("./Helpers/ExchangeFixtures");
const { tokens } = require("./Helpers/TokenFixtures");

async function flashLoanFixture() {
    const { tokens, exchange, accounts: { user1 }, accounts } = await loadFixture(depositExchangeFixture);

    const FlashLoanUser = await ethers.getContractFactory("FlashLoanUser");
    const flashLoanUser = (await FlashLoanUser.connect(user1).deploy(await exchange.getAddress()));

    return { tokens, exchange, accounts, flashLoanUser };
}

describe("FlashLoanProvider", () => {
    describe("Calling flashLoan from FlashLoand user", () => {
        it("emits a FlashLoan event", async () => {
            const { tokens: { token0 }, exchange, accounts: { user1 }, flashLoanUser } = await loadFixture(flashLoanFixture);
            const AMOUNT = tokens(100);

            console.log("balance before", await token0.balanceOf(await flashLoanUser.getAddress()));
            const transaction = await flashLoanUser.connect(user1).getFlashLoan(await token0.getAddress(), AMOUNT);
            await transaction.wait();
            const { timestamp } = await ethers.provider.getBlock();
            await expect(transaction).to.emit(exchange, "FlashLoan").withArgs(await token0.getAddress(), AMOUNT, timestamp);
            console.log("balance after", await token0.balanceOf(await flashLoanUser.getAddress()));
        })
    })
})
