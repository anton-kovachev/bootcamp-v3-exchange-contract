const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const { deployExchangeFixture, depositExchangeFixture, orderExchangeFixture, calculateFees } = require("./Helpers/ExchangeFixtures");
const { tokens } = require("./Helpers/TokenFixtures");

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
                const { tokens: { token0, token1 }, exchange, accounts, transaction } = await loadFixture(depositExchangeFixture);
                const AMOUNT = tokens(100);

                expect(await token0.balanceOf(accounts.user1.address)).to.equal(0);
                expect(await token0.balanceOf(await exchange.getAddress())).to.equal(AMOUNT);
                expect(await exchange.totalBalanceOf(accounts.user1.address, await token0.getAddress())).to.equal(AMOUNT);

                expect(await token1.balanceOf(accounts.user2.address)).to.equal(0);
                expect(await token1.balanceOf(await exchange.getAddress())).to.equal(AMOUNT);
                expect(await exchange.totalBalanceOf(accounts.user2.address, await token1.getAddress())).to.equal(AMOUNT);
            })

            it("emits a TokenDeposited event", async () => {
                const { tokens: { token0 }, exchange, accounts: { user1 }, transaction } = await loadFixture(depositExchangeFixture);
                const AMOUNT = tokens(100);

                await expect(transaction).to.emit(exchange, "TokensDeposited").withArgs(await token0.getAddress(), user1.address, AMOUNT, AMOUNT);
            })
        })

        describe("Failure", () => {
            it("fails when no tokens are approved", async () => {
                const { tokens: { token0 }, exchange, accounts: { user1 } } = await loadFixture(deployExchangeFixture);
                const AMOUNT = tokens(100);

                const transaction = exchange.connect(user1).depositToken(await token0.getAddress(), AMOUNT);
                await expect(transaction).to.be.reverted;
            })
        })
    })

    describe("Withdraw tokens", () => {
        describe("Success", () => {
            it("tracks the token withdraw", async () => {
                const { tokens: { token0 }, exchange, accounts: { user1 } } = await loadFixture(depositExchangeFixture);
                const AMOUNT = tokens(100);

                const transaction = await exchange.connect(user1).withdrawToken(await token0.getAddress(), AMOUNT);
                await transaction.wait();

                expect(await token0.balanceOf(user1.address)).to.equal(AMOUNT);
                expect(await exchange.totalBalanceOf(await token0.getAddress(), user1.address)).to.equal(0);

            })

            it("emits a token withdraw event", async () => {
                const { tokens: { token0 }, exchange, accounts: { user1 } } = await loadFixture(depositExchangeFixture);
                const AMOUNT = tokens(100);

                const transaction = await exchange.connect(user1).withdrawToken(await token0.getAddress(), AMOUNT);
                await transaction.wait();

                await expect(transaction).to.emit(exchange, "TokensWithdraw").withArgs(await token0.getAddress(), user1.address, AMOUNT, 0);
            })
        })

        describe("Failure", () => {
            it("fails when amount exceeds deposit", async () => {
                const { tokens: { token0 }, exchange, accounts: { user1 } } = await loadFixture(depositExchangeFixture);
                const AMOUNT = tokens(101);

                const transaction = exchange.connect(user1).withdrawToken(await token0.getAddress(), AMOUNT);
                await expect(transaction).to.be.revertedWith("Exchange: Insufficient token balance.")
            })
        })
    })

    describe("Making Orders", () => {
        describe("Success", () => {
            it("tracks a newly created order", async () => {
                const { exchange } = await loadFixture(orderExchangeFixture);
                expect(await exchange.orderCount()).to.equal(1);
            })

            it("emits a Create Order event", async () => {
                const { tokens: { token0, token1 }, exchange, accounts: { user1 }, transaction } = await loadFixture(orderExchangeFixture);
                const AMOUNT = tokens(1);
                const { timestamp } = await ethers.provider.getBlock();

                await expect(transaction).to.emit(exchange, "OrderCreated").withArgs(user1.address, await token1.getAddress(), AMOUNT, await token0.getAddress(), AMOUNT, timestamp);
            })
        })

        describe("Fail", () => {
            it("fails when token give amount exceeds deposited amount", async () => {
                const { tokens: { token0, token1 }, exchange, accounts: { user1 } } = await loadFixture(depositExchangeFixture);
                const AMOUNT = tokens(101);
                const ERROR = "Exchange: Insufficient token balance.";

                const transaction = exchange.connect(user1).makeOrder(await token1.getAddress(), AMOUNT, await token0.getAddress(), AMOUNT);
                await expect(transaction).to.be.revertedWith(ERROR);
            })
        })
    })

    describe("Cancel Order", () => {
        describe("Success", () => {
            it("track cancelled order", async () => {
                const { tokens: { token0, token1 }, exchange, accounts: { user1 } } = await loadFixture(orderExchangeFixture);

                const transaction = await exchange.connect(user1).cancelOrder(1);
                await transaction.wait();

                expect(await exchange.isOrderCancelled(1)).to.equal(true);
            })

            it("active balance of", async () => {
                const { tokens: { token0, token1 }, exchange, accounts: { user1 } } = await loadFixture(orderExchangeFixture);

                const transaction = await exchange.connect(user1).cancelOrder(1);
                await transaction.wait();

                expect(await exchange.activeBalanceOf(await token0.getAddress(), user1.address)).to.equal(0);
            })

            it("emits an order cancelled event", async () => {
                const { tokens: { token0, token1 }, exchange, accounts: { user1 } } = await loadFixture(orderExchangeFixture);
                const ORDER_ID = 1;
                const AMOUNT = tokens(1);

                const transaction = await exchange.connect(user1).cancelOrder(ORDER_ID);
                await transaction.wait();
                const { timestamp } = await ethers.provider.getBlock();

                await expect(transaction).to.emit(exchange, "OrderCancelled").withArgs(user1.address, await token1.getAddress(), AMOUNT, await token0.getAddress(), AMOUNT, timestamp);
            })
        })

        describe("Fail", () => {
            it("cancelling a cancelled order", async () => {
                const { exchange, accounts: { user1 } } = await loadFixture(orderExchangeFixture);
                const ORDER_ID = 1;
                const ERROR = "Exchange: Order already cancelled."

                await (await exchange.connect(user1).cancelOrder(ORDER_ID)).wait();
                const transaction = exchange.connect(user1).cancelOrder(1);

                await expect(transaction).to.be.revertedWith(ERROR);
            })

            it("cancelling a none existing order", async () => {
                const { exchange, accounts: { user1 } } = await loadFixture(orderExchangeFixture);
                const ORDER_ID = 20;
                const ERROR = "Exchange: Order does not exists."

                const transaction = exchange.connect(user1).cancelOrder(ORDER_ID);

                await expect(transaction).to.be.revertedWith(ERROR);
            })

            it("cancelling another user's order order", async () => {
                const { exchange, accounts: { user2 } } = await loadFixture(orderExchangeFixture);
                const ORDER_ID = 1;
                const ERROR = "Exchange: Not the owner of the order."

                const transaction = exchange.connect(user2).cancelOrder(ORDER_ID);

                await expect(transaction).to.be.revertedWith(ERROR);
            })
        })
    })

    describe("Filling Orders", () => {
        describe("Success", () => {
            it("executes trades and charges fees", async () => {
                const { tokens: { token0, token1 }, exchange, accounts: { user1, user2, feeAccount } } = await loadFixture(orderExchangeFixture);
                const ORDER_ID = 1;
                const GIVE_AMOUNT = ethers.parseUnits("1", 18);
                const GET_AMOUNT = ethers.parseUnits("1", 18);
                const REMAINING_AMOUNT = ethers.parseUnits("99", 18);
                const FEE_PERCENT = await exchange.feePercent();

                const transaction = await exchange.connect(user2).fillOrder(ORDER_ID);
                transaction.wait();

                expect(await exchange.totalBalanceOf(user1.address, token0)).to.equal(REMAINING_AMOUNT);
                expect(await exchange.totalBalanceOf(user1.address, token1)).to.equal(GET_AMOUNT);
                expect(await exchange.activeBalanceOf(user1.address, token0)).to.equal(0);

                expect(await exchange.totalBalanceOf(feeAccount, token0)).to.equal(0);
                expect(await exchange.totalBalanceOf(feeAccount, token1)).to.equal(calculateFees(GET_AMOUNT, FEE_PERCENT));

                expect(await exchange.totalBalanceOf(user2.address, token0)).to.equal(GIVE_AMOUNT);
                expect(await exchange.totalBalanceOf(user2.address, token1)).to.equal(REMAINING_AMOUNT - calculateFees(GET_AMOUNT, FEE_PERCENT));

            })

            it("emits an Order Filled event", async () => {
                const { tokens: { token0, token1 }, exchange, accounts: { user1, user2, feeAccount } } = await loadFixture(orderExchangeFixture);
                const ORDER_ID = 1;
                const GIVE_AMOUNT = ethers.parseUnits("1", 18);
                const GET_AMOUNT = ethers.parseUnits("1", 18);
                const REMAINING_AMOUNT = ethers.parseUnits("99", 18);

                const transaction = await exchange.connect(user2).fillOrder(ORDER_ID);
                await transaction.wait();

                const { timestamp } = await ethers.provider.getBlock();
                await expect(transaction).to.emit(exchange, "OrderFilled").withArgs(ORDER_ID, await user2.getAddress(), await token1.getAddress(), GET_AMOUNT, await token0.getAddress(), GIVE_AMOUNT, await user1.getAddress(), timestamp);
            })

            it("marks the order as filled", async () => {
                const { exchange, accounts: { user2 } } = await loadFixture(orderExchangeFixture);
                const ORDER_ID = 1;
                const transaction = await exchange.connect(user2).fillOrder(ORDER_ID);
                await transaction.wait();

                expect(await exchange.isOrderFilled(ORDER_ID)).to.equal(true);
            })
        })

        describe("Failure", () => {
            it("rejects filling an unexisting order", async () => {
                const { exchange, accounts: { user2 } } = await loadFixture(orderExchangeFixture);
                const ORDER_ID = 2;
                const ERROR = "Exchange: Order does not exists.";

                const transaction = exchange.connect(user2).fillOrder(ORDER_ID);
                await expect(transaction).to.be.revertedWith(ERROR);
            })

            it("rejects filling an order twice", async () => {
                const { exchange, accounts: { user2 } } = await loadFixture(orderExchangeFixture);
                const ORDER_ID = 1;
                const ERROR = "Exchange: Order is already filled.";

                await (await exchange.connect(user2).fillOrder(ORDER_ID)).wait();
                const transaction = exchange.connect(user2).fillOrder(ORDER_ID);

                await expect(transaction).to.be.revertedWith(ERROR);
            })

            it("rejects filling a cancelled order", async () => {
                const { exchange, accounts: { user1, user2 } } = await loadFixture(orderExchangeFixture);
                const ORDER_ID = 1;
                const ERROR = "Exchange: Order is cancelled.";

                await (await exchange.connect(user1).cancelOrder(ORDER_ID))
                const transaction = exchange.connect(user2).fillOrder(ORDER_ID);

                await expect(transaction).to.be.revertedWith(ERROR);
            })


            it("rejects filling an order when all the balance is active ", async () => {
                const { tokens: { token0, token1 }, exchange, accounts: { user2 } } = await loadFixture(orderExchangeFixture);
                const ORDER_ID = 1;
                const ERROR = "Exchange: Insufficient tokenGet balance.";
                const AMOUNT = tokens(100, 18);

                await (await exchange.connect(user2).makeOrder(await token0.getAddress(), AMOUNT, await token1.getAddress(), AMOUNT)).wait();
                const transaction = exchange.connect(user2).fillOrder(ORDER_ID);

                await expect(transaction).to.be.revertedWith(ERROR);
            })
        })
    })
})