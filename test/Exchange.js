const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const { deployExchangeFixture } = require("./Helpers/ExchangeFixtures");

describe("Exchange", () => {
    describe("Deployment", () => {
        it("", async () => {
            const { exchange, accounts, feePercent } = await loadFixture(deployExchangeFixture);
            expect(await exchange.owner()).to.equal(accounts.deployer.address);
            expect(await exchange.feeAccount()).to.equal(accounts.feeAccount.address);
            expect(await exchange.feePercent()).to.equal(feePercent)
        })
    })
})