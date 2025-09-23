const deployTokenFixture = async () => {
    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy("Dapp University", "DAPP", 1_000_000);

    return { token }
}

module.exports = {
    deployTokenFixture
}