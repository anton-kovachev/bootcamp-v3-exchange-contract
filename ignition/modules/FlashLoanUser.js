const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("FlashLoanModule", (m) => {
    const DEPLOYER = m.getAccount(0);
    const EXCHANGE_ADDRESS = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

    const flashLoanUser = m.contract("FlashLoanUser", [EXCHANGE_ADDRESS], { from: DEPLOYER });

    return { flashLoanUser };
})