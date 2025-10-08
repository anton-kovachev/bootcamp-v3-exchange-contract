const { ethers } = require("hardhat");
const {
  TASK_COMPILE_TRANSFORM_IMPORT_NAME,
} = require("hardhat/builtin-tasks/task-names");

const deployTokenFixture = async () => {
  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy("Dapp University", "DAPP", 1_000_000);
  const [deployer, receiver, exchange] = await ethers.getSigners();

  return { token, deployer, receiver, exchange };
};

async function transferFromTokenFixture() {
  const { token, deployer, receiver, exchange } = await deployTokenFixture();

  const AMOUNT = ethers.parseUnits("100", 18);

  await (
    await token.connect(deployer).approve(exchange.address, AMOUNT)
  ).wait();
  const transaction = await token
    .connect(exchange)
    .transferFrom(deployer.address, receiver.address, AMOUNT);
  await transaction.wait();

  return { token, deployer, receiver, exchange, transaction };
}

function tokens(n) {
  return ethers.parseUnits(n.toString(), 18);
}

module.exports = {
  deployTokenFixture,
  transferFromTokenFixture,
  tokens,
};
