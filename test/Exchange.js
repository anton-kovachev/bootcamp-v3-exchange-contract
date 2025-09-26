const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const { deployExchangeFixture, depositExchangeFixture } = require("./Helpers/ExchangeFixtures");

describe("Exchange", () => {
    describe("Deployment", () => {
        it("", async () => {
            const { exchange, accounts, feePercent } = await loadFixture(deployExchangeFixture);
            expect(await exchange.owner()).to.equal(accounts.deployer.address);
            expect(await exchange.feeAccount()).to.equal(accounts.feeAccount.address);
            expect(await exchange.feePercent()).to.equal(feePercent)
        })
    })

    describe("Depositing Tokens", () => {
        describe("Success", () => {
            it("tracks the token deposit", async () => {
                const { tokens, exchange, accounts, transaction } = await loadFixture(depositExchangeFixture);
                const AMOUNT = ethers.parseUnits("100", 18);

                expect(await tokens.token0.balanceOf(accounts.user1.address)).to.equal(0);
                expect(await tokens.token0.balanceOf(await exchange.getAddress())).to.equal(AMOUNT);
                expect(await exchange.totalBalanceOf(await tokens.token0.getAddress(), accounts.user1.address)).to.equal(AMOUNT);

                expect(await tokens.token1.balanceOf(accounts.user2.address)).to.equal(0);
                expect(await tokens.token1.balanceOf(await exchange.getAddress())).to.equal(AMOUNT);
                expect(await exchange.totalBalanceOf(await tokens.token1.getAddress(), accounts.user2.address)).to.equal(AMOUNT);
            })

            it("emits a TokenDeposited event", async () => {
                const { tokens: { token0 }, exchange, accounts: { user1 }, transaction } = await loadFixture(depositExchangeFixture);
                const AMOUNT = ethers.parseUnits("100", 18);

                await expect(transaction).to.emit(exchange, "TokensDeposited").withArgs(await token0.getAddress(), user1.address, AMOUNT, AMOUNT);
            })
        })

        describe("Failure", () => {
            it("fails when no tokens are approved", async () => {
                const { tokens: { token0 }, exchange, accounts: { user1 } } = await loadFixture(deployExchangeFixture);
                const AMOUNT = ethers.parseUnits("100", 18);

                const transaction = exchange.connect(user1).depositToken(await token0.getAddress(), AMOUNT);
                await expect(transaction).to.be.reverted;
            })
        })
    })

    describe("Withdraw tokens", () => {
        describe("Success", () => {
            it("tracks the token withdraw", async () => {
                const { tokens: { token0 }, exchange, accounts: { user1 } } = await loadFixture(depositExchangeFixture);
                const AMOUNT = ethers.parseUnits("100", 18);

                const transaction = await exchange.connect(user1).withdrawToken(await token0.getAddress(), AMOUNT);
                await transaction.wait();

                expect(await token0.balanceOf(user1.address)).to.equal(AMOUNT);
                expect(await exchange.totalBalanceOf(await token0.getAddress(), user1.address)).to.equal(0);

            })

            it("emits a token withdraw event", async () => {
                const { tokens: { token0 }, exchange, accounts: { user1 } } = await loadFixture(depositExchangeFixture);
                const AMOUNT = ethers.parseUnits("100", 18);

                const transaction = await exchange.connect(user1).withdrawToken(await token0.getAddress(), AMOUNT);
                await transaction.wait();

                await expect(transaction).to.emit(exchange, "TokensWithdraw").withArgs(await token0.getAddress(), user1.address, AMOUNT, 0);
            })
        })

        describe("Failure", () => {
            it("fails when amount exceeds deposit", async () => {
                const { tokens: { token0 }, exchange, accounts: { user1 } } = await loadFixture(depositExchangeFixture);
                const AMOUNT = ethers.parseUnits("101", 18);

                const transaction = exchange.connect(user1).withdrawToken(await token0.getAddress(), AMOUNT);
                await expect(transaction).to.be.revertedWith("Exchange: Insufficient token balance.")
            })
        })
    })
})