const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployTokenFixture } = require("./Helpers/TokenFixtures");

describe("Token", () => {
    const tokens = (n) => {
        return ethers.parseUnits(n, 18);
    }

    describe("Deployed", () => {
        it("has correct name assigned", async () => {
            const { token } = await loadFixture(deployTokenFixture);
            expect(await token.name()).to.equal("Dapp University")
        })

        it("has correct symbol assigned", async () => {
            const { token } = await loadFixture(deployTokenFixture);
            expect(await token.symbol()).to.equal("DAPP");
        })

        it("has correct decimals number assigned", async () => {
            const { token } = await loadFixture(deployTokenFixture);
            expect(await token.decimals()).to.equal(18);
        })

        it("has correct total supply assigned", async () => {
            const { token } = await loadFixture(deployTokenFixture);
            expect(await token.totalSupply()).to.equal(tokens("1000000"));
        })
    })
})