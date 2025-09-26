const { ethers } = require("hardhat")

async function deployExchangeFixture() {
    const Exchange = await ethers.getContractFactory("Exchange");
    const Token = await ethers.getContractFactory("Token");

    const token0 = await Token.deploy("DAAP University", "DAPP", 1000000);
    const token1 = await Token.deploy("Mock Dai", "mDai", 1000000);

    const [deployer, feeAccount, user1, user2] = await ethers.getSigners();
    const FEE_PERCENT = 10;

    const exchange = await Exchange.deploy(deployer.address, feeAccount.address, FEE_PERCENT);
    const AMOUNT = ethers.parseUnits("100", 18);

    await (await token0.connect(deployer).transfer(user1.address, AMOUNT)).wait();
    await (await token1.connect(deployer).transfer(user2.address, AMOUNT)).wait();

    return { tokens: { token0, token1 }, exchange, accounts: { deployer, feeAccount, user1, user2 }, feePercent: FEE_PERCENT };
}

async function depositExchangeFixture() {
    const { tokens, exchange, accounts } = await deployExchangeFixture();
    const AMOUNT = ethers.parseUnits("100", 18);

    await (await tokens.token0.connect(accounts.user1).approve(await exchange.getAddress(), AMOUNT)).wait();
    const transaction = await exchange.connect(accounts.user1).depositToken(await tokens.token0.getAddress(), AMOUNT);
    await transaction.wait();

    await (await tokens.token1.connect(accounts.user2).approve(await exchange.getAddress(), AMOUNT)).wait();
    await (await exchange.connect(accounts.user2).depositToken(await tokens.token1.getAddress(), AMOUNT)).wait();

    return { tokens, exchange, accounts, transaction };
}

async function orderExchangeFixture() {
    const { tokens, exchange, accounts } = await depositExchangeFixture();
    const { token0, token1 } = tokens;
    const { user1 } = accounts;
    const AMOUNT = ethers.parseUnits("1", 18);

    const transaction = await exchange.connect(user1).makeOrder(await token1.getAddress(), AMOUNT, await token0.getAddress(), AMOUNT);
    await transaction.wait();

    return { tokens, exchange, accounts, transaction };
}

module.exports = {
    deployExchangeFixture,
    depositExchangeFixture,
    orderExchangeFixture
}