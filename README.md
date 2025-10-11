# Decentralized Exchange (DEX) Interface

A Next.js-based frontend for a decentralized cryptocurrency exchange that enables users to trade ERC-20 tokens on Ethereum networks. This interface provides wallet connectivity, token swapping, order management, and portfolio tracking capabilities.

## Live Demo

🚀 **Test the application**: [https://dex-exchange-beryl.vercel.app/](https://dex-exchange-beryl.vercel.app/)

The demo is deployed and configured to work with the Tenderly Virtual Network for safe testing without real funds.

### Testing Setup

To test the live application, you need to configure the Tenderly network in MetaMask:

1. **Add Tenderly Network to MetaMask:**

   - Network Name: `Tenderly Virtual Network`
   - RPC URL: `https://virtual.mainnet.eu.rpc.tenderly.co/569cd13a-72d9-4eec-8abc-ea6a24bfa7df`
   - Chain ID: `4`
   - Currency Symbol: `ETH`

2. **Switch to Tenderly Network** in MetaMask after adding it

3. **Get Test Funds** - The network provides test ETH and tokens for experimentation

4. **Start Trading** - All exchange functionality is available for testing without risk

## Purpose

This application serves as the user interface for a decentralized exchange smart contract system, allowing users to:

- **Connect MetaMask wallet** and manage multiple Ethereum networks
- **Deposit/withdraw tokens** between wallet and exchange
- **Place buy/sell orders** for supported token pairs
- **View real-time order books** and market data
- **Track portfolio balances** across wallet and exchange
- **Execute market and limit orders** with automated matching

## Technologies

### Frontend Stack

- **Next.js 13+** with App Router for modern React development
- **Redux Toolkit** for centralized state management
- **ethers.js v6** for Ethereum blockchain interactions
- **MetaMask SDK** for wallet connectivity and transaction signing

### Blockchain Integration

- **Smart Contracts**: Custom DEX contracts deployed on Ethereum networks
- **Token Standards**: ERC-20 token support with automatic metadata fetching
- **Network Support**: Configurable for multiple Ethereum networks (mainnet, testnets)

### Development Tools

- **React Hooks**: Custom hooks for blockchain state management
- **CSS Modules**: Component-scoped styling
- **JSON Configuration**: Network and contract address management

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MetaMask browser extension
- Access to an Ethereum network (testnet recommended for development)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd bootcamp-v3-interface
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Configure networks and contract addresses in `app/config.json`:

```json
{
  "31337": {
    "exchange": "0x...",
    "DApp": "0x...",
    "mETH": "0x...",
    "mDAI": "0x..."
  }
}
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### MetaMask Setup

1. Install MetaMask browser extension
2. Create or import an Ethereum wallet
3. Add your development network (if using local blockchain)
4. Ensure you have test ETH and tokens for transactions

## Development & Debugging

### Project Structure

```
app/
├── components/          # Reusable UI components
├── hooks/              # Custom blockchain hooks
├── abis/               # Smart contract ABIs
├── wallet/             # Wallet management pages
├── exchange/           # Trading interface pages
└── config.json         # Network configurations

lib/
├── features/           # Redux slices
├── selectors.js        # Reselect selectors
└── store.js           # Redux store configuration
```

### Key Development Patterns

**Custom Hooks for Blockchain State:**

```javascript
const { provider } = useProvider(); // Web3 provider
const { exchange } = useExchange(); // Exchange contract
const { tokens } = useTokens(); // Token contracts
```

**Redux State Management:**

```javascript
const account = useAppSelector(selectAccount);
const balances = useAppSelector(selectWalletBalances);
```

**Contract Interaction Pattern:**

```javascript
// Always check contract availability
if (tokenContracts && exchange && account) {
  const balance = await token.balanceOf(account);
  dispatch(setBalance({ address, wallet: ethers.formatUnits(balance, 18) }));
}
```

### Debugging Tips

1. **Browser Console**: Check for contract interaction errors and transaction logs
2. **MetaMask**: Monitor transaction confirmations and rejections
3. **Redux DevTools**: Inspect state changes and dispatched actions
4. **Network Tab**: Verify RPC calls to blockchain nodes

### Common Development Tasks

**Adding New Token Support:**

1. Deploy token contract to your network
2. Add contract address to `app/config.json`
3. The interface will automatically detect and load the token

**Testing Contract Interactions:**

1. Use browser console to inspect contract calls
2. Check MetaMask for transaction details
3. Verify state updates in Redux DevTools

**Network Switching:**

1. Update `config.json` with new network configuration
2. Add network to MetaMask
3. Switch network via TopNav component

## Deployment

### Production Build

```bash
npm run build
npm start
```

### Vercel Deployment

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme):

1. Connect your repository to Vercel
2. Configure environment variables if needed
3. Deploy with automatic CI/CD

### Environment Configuration

For production deployment, ensure:

- Contract addresses are configured for target networks
- RPC endpoints are reliable and production-ready
- CORS settings allow your domain for contract interactions

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [ethers.js Documentation](https://docs.ethers.org/) - Ethereum library documentation
- [Redux Toolkit Guide](https://redux-toolkit.js.org/) - State management patterns
- [MetaMask SDK](https://docs.metamask.io/wallet/how-to/use-sdk/) - Wallet integration guide

## Contributing

1. Fork the repository
2. Create a feature branch
3. Implement changes with proper testing
4. Submit a pull request with detailed description

## License

This project is part of a blockchain development bootcamp and is intended for educational purposes.
