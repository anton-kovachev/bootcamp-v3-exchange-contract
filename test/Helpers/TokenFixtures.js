const { ethers } = require("hardhat");

const deployTokenFixture = async () => {
    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy("Dapp University", "DAPP", 1_000_000);
    const [deployer, receiver, exchange] = await ethers.getSigners();

    return { token, deployer, receiver, exchange }
}

module.exports = {
    deployTokenFixture
}