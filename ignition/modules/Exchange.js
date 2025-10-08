const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("ExchangeModule", (m) => {
  const DEPLOYER = m.getAccount(0);
  const FEE_ACCOUNT = m.getAccount(1);
  const FEE_PERCENT = 10;

  const exchnage = m.contract(
    "Exchange",
    [DEPLOYER, FEE_ACCOUNT, FEE_PERCENT],
    { from: DEPLOYER }
  );
  return { exchnage };
});
