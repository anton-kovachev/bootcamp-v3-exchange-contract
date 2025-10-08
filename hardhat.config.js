require("@nomicfoundation/hardhat-toolbox");
const { vars } = require("hardhat/config");

const TENDERLY_API_KEY = vars.get("TENDERLY_API_KEY");
const DEPLOYER_PRIVATE_KEY = vars.get("DEPLOYER_PRIVATE_KEY");
const COLLECTOR_PRIVATE_KEY = vars.get("COLLECTOR_PRIVATE_KEY");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    tenderly: {
      url: `https://virtual.mainnet.eu.rpc.tenderly.co/${TENDERLY_API_KEY}`,
      accounts: [DEPLOYER_PRIVATE_KEY, COLLECTOR_PRIVATE_KEY],
    },
  },
};
