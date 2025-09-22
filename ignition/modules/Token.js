// this setup uses hardhat ignition to manage smart contract deployments.
// learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("TokenModule", (m) => {

    const token = m.contract("Token", [], {});
    return { token };
});
