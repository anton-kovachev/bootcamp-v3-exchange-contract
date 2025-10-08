# DAAP Exchange Smart Contract Project

A decentralized exchange (DEX) smart contract project built with Hardhat, featuring token trading, liquidity provision, and flash loan functionality.

## Project Overview

This project includes:

- **Token Contract**: ERC-20 token implementation for DAPPU, mUSDC, and mLINK tokens
- **Exchange Contract**: Decentralized exchange for token swapping and liquidity provision
- **FlashLoan Contracts**: Flash loan provider and user contracts for instant, uncollateralized loans

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd bootcamp-v3-contracts
```

2. Install the required packages:

```bash
npm install
```

## Setup and Deployment

### 1. Verify Code Functionality

Run the test suite to ensure all contracts are working correctly:

```bash
npx hardhat test
```

### 2. Start Local Hardhat Network

Start a local Hardhat node in a separate terminal:

```bash
npx hardhat node
```

This will start a local blockchain network on `http://localhost:8545` with 20 test accounts.

### 3. Deploy Contracts

Deploy the contracts in the following order:

#### Deploy Token Contracts

```bash
npx hardhat ignition deploy ./ignition/modules/Token.js
```

#### Deploy Exchange Contract

```bash
npx hardhat ignition deploy ./ignition/modules/Exchange.js --network localhost
```

#### Deploy FlashLoan User Contract

```bash
npx hardhat ignition deploy ./ignition/modules/FlashLoanUser.js --network localhost
```

### 4. Update Contract Addresses

After deployment, update the contract addresses in the seed script (`scripts/seed.js`) with the address of the contract on your local Hardhat network node:

```javascript
const DAPPU_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const mUSDC_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const mLINK_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const EXCHANGE_ADDRESS = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
const FLASHLOAN_USER_ADDRESS = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
```

**Note**: Replace these addresses with the actual deployed contract addresses from your deployment output.

### 5. Populate Contracts with Data

Run the seed script to populate the contracts with initial data:

```bash
npx hardhat run ./scripts/seed.js --network localhost
```

## Project Structure

```
bootcamp-v3-contracts/
├── contracts/              # Smart contracts
│   ├── Token.sol          # ERC-20 token contract
│   ├── Exchange.sol       # DEX contract
│   ├── FlashLoanProvider.sol # Flash loan provider
│   └── FlashLoanUser.sol  # Flash loan user
├── ignition/              # Deployment modules
│   └── modules/
│       ├── Token.js       # Token deployment script
│       ├── Exchange.js    # Exchange deployment script
│       └── FlashLoanUser.js # FlashLoan deployment script
├── scripts/               # Utility scripts
│   └── seed.js           # Data seeding script
├── test/                 # Test files
│   ├── Token.js          # Token tests
│   ├── Exchange.js       # Exchange tests
│   └── FlashLoanProvider.js # FlashLoan tests
└── hardhat.config.js     # Hardhat configuration
```

## Available Scripts

- `npx hardhat test` - Run all tests
- `npx hardhat node` - Start local blockchain network
- `npx hardhat compile` - Compile smart contracts
- `npx hardhat clean` - Clean compilation artifacts

## Features

### Token Contract

- ERC-20 compliant token implementation
- Supports DAPPU, mUSDC, and mLINK tokens
- Standard transfer, approve, and allowance functionality

### Exchange Contract

- Token swapping functionality
- Liquidity provision and withdrawal
- Automated market maker (AMM) mechanics
- Fee collection for liquidity providers

### Flash Loan System

- Instant, uncollateralized loans
- Flash loan provider with configurable fees
- Flash loan user contract for executing complex transactions

## Network Configuration

The project is configured to work with:

- **Local Network**: Hardhat node (localhost:8545)
- **Testnet**: Can be configured for Ethereum testnets
- **Mainnet**: Production deployment (configure with caution)

## Security Considerations

- All contracts should be thoroughly audited before mainnet deployment
- Flash loan functionality requires careful implementation to prevent exploits
- Always test on testnets before mainnet deployment
- Consider implementing additional security measures like pause functionality

## Troubleshooting

### Common Issues

1. **Deployment fails**: Ensure the local Hardhat node is running
2. **Contract addresses not found**: Verify deployment was successful and addresses are correct
3. **Seed script fails**: Ensure all contracts are deployed and addresses are updated

### Getting Help

- Check the Hardhat documentation: https://hardhat.org/docs
- Review contract code in the `contracts/` directory
- Examine test files for usage examples

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
