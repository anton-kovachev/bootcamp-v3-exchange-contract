const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("TokenModule", (m) => {
    const TOTAL_SUPPLY = 1000000;
    const DEPLOYER = m.getAccount(0);

    const DAAP = m.contract("Token", ["Daap University", "DAPP", TOTAL_SUPPLY], { from: DEPLOYER, id: "DAPPU" });
    const mUSDC = m.contract("Token", ["Mocked USDC", "mUSDC", TOTAL_SUPPLY], { from: DEPLOYER, id: "mUSDC" });
    const mLINK = m.contract("Token", ["Mocked Link", "mLINK", TOTAL_SUPPLY], { from: DEPLOYER, id: "mLINK" });

    return { DAAP, mUSDC, mLINK }
});
