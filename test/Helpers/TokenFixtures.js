const { ethers } = require("hardhat");

const deployTokenFixture = async () => {
    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy("Dapp University", "DAPP", 1_000_000);
    const [deployer] = await ethers.getSigners();

    return { token, deployer }
}

module.exports = {
    deployTokenFixture
}