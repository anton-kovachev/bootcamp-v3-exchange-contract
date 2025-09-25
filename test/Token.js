const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployTokenFixture, transferFromTokenFixture, tokens } = require("./Helpers/TokenFixtures");

describe("Token", () => {
    const NAME = "Dapp University";
    const SYMBOL = "DAPP";
    const DECIMALS = 18;
    const TOTAL_SUPPLY = tokens("1000000");

    describe("Deployment", () => {
        it("has correct name assigned", async () => {
            const { token } = await loadFixture(deployTokenFixture);
            expect(await token.name()).to.equal(NAME)
        })

        it("has correct symbol assigned", async () => {
            const { token } = await loadFixture(deployTokenFixture);
            expect(await token.symbol()).to.equal(SYMBOL);
        })

        it("has correct decimals number assigned", async () => {
            const { token } = await loadFixture(deployTokenFixture);
            expect(await token.decimals()).to.equal(DECIMALS);
        })

        it("has correct total supply", async () => {
            const { token } = await loadFixture(deployTokenFixture);
            expect(await token.totalSupply()).to.equal(TOTAL_SUPPLY);
        })

        describe("Owner", async () => {
            it("has correct total supply assigned", async () => {
                const { token, deployer } = await loadFixture(deployTokenFixture);
                expect(await token.balanceOf(deployer.address)).to.equal(TOTAL_SUPPLY);
            })
        })
    })

    describe("Sending Tokens", () => {
        it("Transfer token balances", async () => {
            const { token, deployer, receiver } = await loadFixture(deployTokenFixture);
            const transaction = await token.connect(deployer).transfer(receiver.address, tokens("100"));
            await transaction.wait();

            expect(await token.balanceOf(deployer.address)).to.equal(tokens("999900"))
            expect(await token.balanceOf(receiver.address)).to.equal(tokens("100"))
        })

        it("emits a transfer event", async () => {
            const { token, deployer, receiver } = await loadFixture(deployTokenFixture);
            const transaction = await token.connect(deployer).transfer(receiver.address, tokens("100"));
            await transaction.wait();

            expect(transaction).to.emit(token, "Transfer")
                .withArgs(deployer.address, receiver.address, tokens("100"));
        })

        it("reject insufficient balances", async () => {
            const { token, deployer, receiver } = await loadFixture(deployTokenFixture);

            const INVALID_AMOUNT = tokens("100000000");
            await expect(token.connect(deployer).transfer(receiver.address, INVALID_AMOUNT)).to.be.revertedWith("Token: insufficient funds.")
        })

        it("reject invalid recipient", async () => {
            const { token, deployer, receiver } = await loadFixture(deployTokenFixture);
            const INVALID_ADDRESS = "0x0000000000000000000000000000000000000000";

            await expect(token.connect(deployer).transfer(INVALID_ADDRESS, tokens("100"))).to.be.revertedWith("Token: recipient is address 0.")
        })
    })

    describe("Approving Tokens", () => {
        describe("Success", () => {
            it("allocates an allowance for delegated token spending", async () => {
                const AMOUNT = tokens("100");
                const { token, deployer, exchange } = await loadFixture(deployTokenFixture);

                const transaction = await token.connect(deployer).approve(exchange.address, AMOUNT);
                await transaction.wait();

                expect(await token.allowance(deployer.address, exchange.address)).to.equal(AMOUNT);
            })

            it("emits an Approval event for delegated token spending", async () => {
                const AMOUNT = tokens("100");
                const { token, deployer, exchange } = await loadFixture(deployTokenFixture);
                const transaction = await token.connect(deployer).approve(exchange.address, AMOUNT);
                await transaction.wait();

                await expect(transaction).to.emit(token, "Approval").withArgs(deployer.address, exchange.address, AMOUNT);
            })
        })

        describe("Failure", () => {
            it("reject invalid spender", async () => {
                const { token, deployer, exchange } = await loadFixture(deployTokenFixture);

                const INVALID_ADDRESS = "0x0000000000000000000000000000000000000000";
                const AMOUNT = tokens("100");

                const transaction = token.connect(deployer).approve(INVALID_ADDRESS, AMOUNT);

                await expect(transaction).to.be.revertedWith("Token: spender is address 0.")
            })
        })
    })

    describe("Delegated Token Transfers", () => {
        const AMOUNT = tokens("100");

        describe("Success", () => {
            it("transfer token balances", async () => {
                const { token, deployer, receiver } = await loadFixture(transferFromTokenFixture);

                expect(await token.balanceOf(deployer.address)).to.equal(tokens("999900"));
                expect(await token.balanceOf(receiver.address)).to.equal(tokens("100"));
            })

            it("resets the allowance", async () => {
                const { token, exchange, deployer } = await loadFixture(transferFromTokenFixture);

                expect(await token.allowance(deployer.address, exchange.address)).to.equal(0);
            })

            it("emits a transfer event", async () => {
                const { token, transaction, deployer, receiver } = await loadFixture(transferFromTokenFixture);

                await expect(transaction).to.emit(token, "Transfer").withArgs(deployer.address, receiver.address, AMOUNT);
            })
        })

        describe("Failure", () => {
            it("reject insufficient funds", async () => {
                const LARGE_AMOUNT = tokens("100000000000")
                const { token, deployer, receiver, exchange } = await loadFixture(transferFromTokenFixture);
                const ERROR = "Token: insufficient funds."

                const transaction = token.connect(exchange).transferFrom(deployer.address, receiver.address, LARGE_AMOUNT);
                await expect(transaction).to.be.revertedWith(ERROR);
            });

            it("reject not allowed funds", async () => {
                const { token, deployer, receiver, exchange } = await loadFixture(transferFromTokenFixture);
                const ERROR = "Token: funds not allowed."

                const transaction = token.connect(exchange).transferFrom(deployer.address, receiver.address, AMOUNT);
                await expect(transaction).to.be.revertedWith(ERROR);
            });

            it("reject insufficient not allowed funds", async () => {
                const { token, deployer, receiver, exchange } = await loadFixture(transferFromTokenFixture);
                const ERROR = "Token: funds not allowed."
                const LARGE_AMOUNT = tokens("1000")

                await token.connect(deployer).approve(exchange.address, tokens("100"))
                const transaction = token.connect(exchange).transferFrom(deployer.address, receiver.address, LARGE_AMOUNT);
                await expect(transaction).to.be.revertedWith(ERROR);
            });

            it("reject from address invalid", async () => {
                const { token, deployer, receiver, exchange } = await loadFixture(transferFromTokenFixture);
                const INVALID_ADDRESS = "0x0000000000000000000000000000000000000000";
                const ERROR = "Token: sender is address 0."

                const transaction = token.connect(exchange).transferFrom(INVALID_ADDRESS, receiver.address, AMOUNT);
                await expect(transaction).to.be.revertedWith(ERROR);
            });

            it("reject to address invalid", async () => {
                const { token, deployer, receiver, exchange } = await loadFixture(transferFromTokenFixture);
                const INVALID_ADDRESS = "0x0000000000000000000000000000000000000000";
                const ERROR = "Token: recipient is address 0."

                const transaction = token.connect(exchange).transferFrom(deployer.address, INVALID_ADDRESS, AMOUNT);
                await expect(transaction).to.be.revertedWith(ERROR);
            });
        })
    })
})