const { ethers } = require("hardhat")

async function deployExchangeFixture() {
    const Exchange = await ethers.getContractFactory("Exchange");
    const [deployer, feeAccount, thirdAccount] = await ethers.getSigners();
    const FEE_PERCENT = 10;

    const exchange = await Exchange.deploy(deployer.address, feeAccount.address, FEE_PERCENT);

    return { exchange, accounts: { deployer, feeAccount }, feePercent: FEE_PERCENT };
}

module.exports = {
    deployExchangeFixture
}