const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployTokenFixture } = require("./Helpers/TokenFixtures");

describe("Token", () => {
    const NAME = "Dapp University";
    const SYMBOL = "DAPP";
    const DECIMALS = 18;

    const tokens = (n) => {
        return ethers.parseUnits(n, 18);
    }
    const TOTAL_SUPPLY = tokens("1000000");

    describe("Deployed", () => {
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
    })

    describe("Owner", async () => {
        it("has correct total supply assigned", async () => {
            const { token, deployer } = await loadFixture(deployTokenFixture);
            expect(await token.balanceOf(deployer.address)).to.equal(TOTAL_SUPPLY);
        })
    })
})