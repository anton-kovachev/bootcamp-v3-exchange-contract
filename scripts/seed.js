const hre = require("hardhat");

const tokens = (n) => {
    return hre.ethers.parseUnits(n.toString(), 18);
}

const wait = async (seconds) => {
    const milliSeconds = seconds * 1000;
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, milliSeconds);
    })
}

async function main() {
    //Load exchnage up with data
    console.log("running seed script...");

    const DAPPU_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const mUSDC_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    const mLINK_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const EXCHANGE_ADDRESS = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
    const FLASHLOAN_USER_ADDRESS = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";

    const dappu = await hre.ethers.getContractAt("Token", DAPPU_ADDRESS);
    console.log(`Token DAPPU fetched: ${await dappu.getAddress()}`);

    const mUSDC = await hre.ethers.getContractAt("Token", mUSDC_ADDRESS);
    console.log(`Token mUSDC fetched: ${await mUSDC.getAddress()}`);

    const mLINK = await hre.ethers.getContractAt("Token", mLINK_ADDRESS);
    console.log(`Token mLINK fetched: ${await mLINK.getAddress()}`);

    const exchnage = await hre.ethers.getContractAt("Exchange", EXCHANGE_ADDRESS);
    console.log(`Exchange fetched: ${await exchnage.getAddress()}`);

    const flashLoanUser = await hre.ethers.getContractAt("FlashLoanUser", FLASHLOAN_USER_ADDRESS);
    console.log(`FlashLoanUser fetched: ${await flashLoanUser.getAddress()}`);

    //Distribute Tokens
    const [deployer, collector, user1, user2] = await hre.ethers.getSigners();
    const AMOUNT = 100000;
    let transaction;
    let result;

    transaction = await dappu.connect(deployer).transfer(user1.address, tokens(AMOUNT));
    await transaction.wait();
    console.log(`Transferred ${AMOUNT} tokens from ${deployer.address} to ${user1.address}.`);

    transaction = await mUSDC.connect(deployer).transfer(user2.address, tokens(AMOUNT));
    await transaction.wait();
    console.log(`Transferred ${AMOUNT} tokens from ${deployer.address} to ${user2.address}.`);

    //Deposit Funds to the Exchange
    transaction = await dappu.connect(user1).approve(EXCHANGE_ADDRESS, tokens(AMOUNT));
    await transaction.wait();
    console.log(`Approved ${AMOUNT} DAPPU tokens from ${user1.address} to exchange ${EXCHANGE_ADDRESS}.`);

    transaction = await exchnage.connect(user1).depositToken(DAPPU_ADDRESS, tokens(AMOUNT));
    await transaction.wait();
    console.log(`Deposited ${AMOUNT} DAPPU tokens from ${user1.address} to exchange ${EXCHANGE_ADDRESS}.`);

    transaction = await mUSDC.connect(user2).approve(EXCHANGE_ADDRESS, tokens(AMOUNT));
    await transaction.wait();
    console.log(`Approved ${AMOUNT} mUSDC tokens from ${user2.address} to exchange ${EXCHANGE_ADDRESS}.`);

    transaction = await exchnage.connect(user2).depositToken(mUSDC_ADDRESS, tokens(AMOUNT));
    await transaction.wait();
    console.log(`Deposited ${AMOUNT} mUSDC tokens from ${user2.address} to exchange ${EXCHANGE_ADDRESS}.`);
    //Cancel some orders
    let orderId;

    transaction = await exchnage.connect(user1).makeOrder(mUSDC_ADDRESS, tokens(100), DAPPU_ADDRESS, tokens(100));
    result = await transaction.wait();
    console.log(result);
    orderId = result.logs[0].args.id;
    console.log(`Made order from ${user1.address} with id: ${result.logs[0].args.id}`);

    transaction = await exchnage.connect(user1).cancelOrder(orderId);
    await transaction.wait();
    console.log(`Cancelled order from ${user1.address} with id: ${result.logs[0].args.id}`);

    await wait(1);

    //Fill some orders
    for (let i = 0; i < 3; i++) {
        transaction = await exchnage.connect(user1).makeOrder(mUSDC_ADDRESS, tokens(10), DAPPU_ADDRESS, tokens(10 * i));
        result = await transaction.wait();
        orderId = result.logs[0].args.id;
        console.log(`Made order from ${user1.address} with id: ${result.logs[0].args.id}`);

        transaction = await exchnage.connect(user2).fillOrder(orderId);
        result = await transaction.wait();
        console.log(`Filled order from ${user2.address} with id: ${result.logs[0].args.id}`);
        await wait(1);
    }

    //Make some open orders
    for (let i = 0; i < 5; i++) {
        transaction = await exchnage.connect(user1).makeOrder(mUSDC_ADDRESS, tokens(10), DAPPU_ADDRESS, tokens(10 * i));
        result = await transaction.wait();
        orderId = result.logs[0].args.id;
        console.log(`Made order from ${user1.address} with id: ${result.logs[0].args.id}`);
        await wait(1);
    }

    for (let i = 0; i < 5; i++) {
        transaction = await exchnage.connect(user2).makeOrder(DAPPU_ADDRESS, tokens(10), mUSDC_ADDRESS, tokens(10 * i));
        result = await transaction.wait();
        orderId = result.logs[0].args.id;
        console.log(`Made order from ${user2.address} with id: ${result.logs[0].args.id}`);
        await wait(1);
    }

    //Perform some Flash loans
    for (let i = 0; i < 3; i++) {
        transaction = await flashLoanUser.connect(user1).getFlashLoan(DAPPU_ADDRESS, tokens(1000));
        result = await transaction.wait();

        console.log(`Flash loan executed from ${user1.address}`)
        wait(1);
    }

    console.log("Balance of user1: ", user1.address, " ", await dappu.balanceOf(user1.address), " ", await exchnage.totalBalanceOf(user1.address, DAPPU_ADDRESS));
    console.log("Balance of user2: ", user2.address, " ", await dappu.balanceOf(user2.address), " ", await exchnage.totalBalanceOf(user2.address, DAPPU_ADDRESS));
    console.log("DAPPU address ", DAPPU_ADDRESS, "Exchange address ", EXCHANGE_ADDRESS);
}

main().catch((error) => {
    console.log(error);
    process.exitCode = 1;
});