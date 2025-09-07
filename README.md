# TestToFund - Test Trust Fund

**Transform your knowledge into rewards. Complete educational courses, validate your learning, and earn TTF tokens.**

🌐 **Live Demo**: [ttf.expose.software](https://ttf.expose.software)

![TestToFund Logo](frontend/public/TestToFund%20Logo.svg)

## 🎯 Project Overview

TestToFund is a comprehensive Test Trust Fund platform that rewards users with TTF (Test To Fund) tokens for completing educational courses and validating their knowledge. Built on the BlockDAG Testnet, it provides a seamless integration between education and blockchain rewards.

### 🌟 Key Features

- **📚 Course Completion Rewards**: Earn 2000 TTF tokens for each completed course
- **🔐 Automatic Wallet Setup**: Seamless BlockDAG testnet integration with MetaMask
- **🏆 Certificate Validation**: Upload Udemy certificates to claim rewards
- **💰 Real-time Token Balance**: Live TTF token balance tracking
- **🔄 Instant Token Distribution**: Automated token distribution upon verification
- **📱 Responsive Design**: Works seamlessly across all devices

## 🏗️ Project Structure

```
TestToFund/
├── README.md
├── frontend/                 # Next.js 15.5.2 Frontend Application
│   ├── package.json
│   ├── next.config.ts
│   ├── tailwind.config.js
│   ├── app/                  # App Router Pages
│   │   ├── page.tsx          # Landing page with animated background
│   │   ├── home/             # Course catalog and featured content
│   │   ├── rewards/          # Main rewards claiming interface
│   │   ├── faucet/           # Token transfer functionality
│   │   ├── videos/           # Video learning modules
│   │   ├── welcome/          # Welcome page with wallet connect
│   │   └── api/              # API routes for rewards claiming
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── BackgroundVideo.tsx
│   │   │   ├── NetworkStatus.tsx
│   │   │   ├── NetworkSetupGuide.tsx
│   │   │   ├── WalletDetection.tsx
│   │   │   └── SendTokensResult.tsx
│   │   ├── contexts/         # React contexts for state management
│   │   └── lib/              # Utility libraries
│   │       ├── web3.ts       # Web3 wallet integration
│   │       └── tokenUtils.ts # Token balance and verification
│   └── public/               # Static assets
│       ├── TestToFund Logo.svg
│       ├── bg-video.mp4      # Background video
│       └── TestToFund Background Text.png
├── backend/                  # Express.js Backend API
│   ├── package.json
│   ├── server.js            # Main server entry point
│   ├── config/              # Database and service configurations
│   │   ├── database.js
│   │   └── mongo.js
│   ├── controllers/         # API endpoint controllers
│   │   ├── authController.js
│   │   ├── rewardController.js
│   │   └── videoController.js
│   ├── models/              # Database models
│   │   ├── User.js          # User wallet and progress tracking
│   │   ├── Video.js         # Video course metadata
│   │   ├── Transaction.js   # Token distribution records
│   │   └── Progress.js      # Learning progress tracking
│   ├── services/            # Business logic services
│   │   ├── blockchainService.js    # Token distribution logic
│   │   ├── rewardService.js        # Reward calculation and issuing
│   │   └── antiCheatService.js     # Anti-fraud detection
│   ├── routes/              # API route definitions
│   │   ├── auth.js
│   │   ├── rewards.js
│   │   ├── videos.js
│   │   └── admin.js
│   ├── middleware/          # Express middleware
│   │   ├── errorHandler.js
│   │   └── validate.js
│   └── tests/               # Test suites
│       ├── unit/
│       └── integration/
└── contracts/               # Smart Contracts (Hardhat)
    ├── package.json
    ├── hardhat.config.js    # BlockDAG testnet configuration
    ├── deployed.env         # Deployed contract addresses
    ├── contracts/           # Solidity smart contracts
    │   ├── TestToFund.sol   # TTF ERC20 token contract
    │   ├── TokenDistributor.sol     # Token distribution contract
    │   └── CertificateNFT.sol       # NFT certificates (future feature)
    ├── scripts/             # Deployment and utility scripts
    │   ├── deploy.js
    │   ├── sendTokens.js    # Token distribution testing
    │   └── verify.js
    └── artifacts/           # Compiled contract artifacts
```

## 🚀 Technology Stack

### Frontend
- **Framework**: Next.js 15.5.2 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **Web3**: Ethers.js v6.13.0
- **UI Components**: Lucide React, Framer Motion
- **Bundler**: Turbopack (Next.js built-in)

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with wallet-based auth
- **Blockchain**: Ethers.js v5.7.2
- **Testing**: Jest with Supertest

### Smart Contracts
- **Framework**: Hardhat 2.17.0
- **Language**: Solidity ^0.8.19
- **Libraries**: OpenZeppelin Contracts 4.9.3
- **Network**: BlockDAG Testnet (EVM Compatible)

### Blockchain Integration
- **Network**: Primordial BlockDAG Testnet
- **Chain ID**: 1043
- **RPC URL**: https://rpc.primordial.bdagscan.com/
- **Explorer**: https://primordial.bdagscan.com/
- **Currency**: BDAG
- **TTF Token Contract**: `0xC02953cdC83C79dB721A25a6d9F0bf5BcC530317`

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- MetaMask or compatible Web3 wallet

### 1. Clone Repository
```bash
git clone https://github.com/anurag-05-cmd/TestToFund.git
cd TestToFund
```

### 2. Frontend Setup
```bash
cd frontend
pnpm install
cp .env.example .env.local

# Add your environment variables to .env.local
# PRIVATE_KEY=your_distribution_wallet_private_key
# TOKEN_ADDRESS=0xC02953cdC83C79dB721A25a6d9F0bf5BcC530317
# RPC_URL=https://rpc.primordial.bdagscan.com/

pnpm dev
```

### 3. Backend Setup
```bash
cd backend
pnpm install
cp .env.example .env

# Configure your .env file with MongoDB and blockchain settings

pnpm dev
```

### 4. Smart Contracts Setup
```bash
cd contracts
pnpm install

# Deploy contracts (optional - already deployed)
pnpm deploy:testnet
```

## 💰 Token Economics

- **Token Name**: Test To Fund (TTF)
- **Token Symbol**: TTF
- **Decimals**: 18
- **Reward per Course**: 2000 TTF
- **Network**: BlockDAG Testnet
- **Contract Address**: `0xC02953cdC83C79dB721A25a6d9F0bf5BcC530317`

## 🎓 How It Works

### For Learners:
1. **Connect Wallet**: Connect your MetaMask to BlockDAG testnet (automatic setup)
2. **Browse Courses**: Explore 20+ featured Udemy courses
3. **Complete Learning**: Finish courses and obtain certificates
4. **Upload Certificate**: Submit your Udemy certificate on the rewards page
5. **Claim Rewards**: Receive 2000 TTF tokens instantly to your wallet

### For Course Providers:
1. **Course Integration**: Submit course details for platform inclusion
2. **Verification System**: Automated certificate validation
3. **Reward Distribution**: Automatic token distribution upon verification

## 🔐 Security Features

### Anti-Cheat System
- **Certificate Verification**: Real-time Udemy certificate validation
- **One-time Claims**: Each wallet can only claim once per course
- **Fraud Detection**: Advanced anti-cheat algorithms
- **Transaction Logging**: All claims logged on-chain for transparency

### Wallet Security
- **Non-custodial**: Users maintain full control of their wallets
- **Automatic Network Setup**: Seamless BlockDAG testnet configuration
- **localStorage Caching**: Prevents repetitive wallet setup prompts
- **Secure Token Distribution**: Direct transfers from distribution wallet

## 📊 Course Catalog

The platform features 20+ carefully curated free Udemy courses across multiple categories:

### 🐍 Python Programming
- Python for Beginners
- Introduction to Python Programming  
- Python from Beginner to Intermediate

### 🧪 Software Testing
- Introduction to Software Testing
- Software Testing Simple (QA)
- Free Software Testing Tutorial

### 📚 Additional Categories
- Essential Tech Skills
- Productivity & Professional Skills
- Online Business Fundamentals

*Each completed course rewards 2000 TTF tokens upon certificate verification.*

## 🔗 API Endpoints

### Rewards API
- `POST /api/rewards/claim` - Claim rewards with certificate
- `GET /api/rewards/history` - Get claim history
- `GET /api/rewards/status` - Check claim eligibility

### User Management
- `POST /api/auth/connect` - Connect wallet
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/disconnect` - Disconnect wallet

### Video System
- `GET /api/videos` - List available videos
- `GET /api/videos/:id` - Get video details
- `POST /api/videos/:id/progress` - Track progress

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
pnpm test
```

### Backend Testing
```bash
cd backend
pnpm test
```

### Smart Contract Testing
```bash
cd contracts
pnpm test
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
pnpm build
pnpm start
```

### Backend (Railway/Heroku)
```bash
cd backend
pnpm start
```

### Smart Contracts
```bash
cd contracts
pnpm deploy:testnet
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🛟 Support

- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Report bugs via GitHub Issues
- **Discord**: Join our community Discord server
- **Email**: contact@testtofund.com

## 🙏 Acknowledgments

- **BlockDAG Team**: For providing the testnet infrastructure
- **Udemy**: For the educational content integration
- **OpenZeppelin**: For secure smart contract libraries
- **Next.js Team**: For the amazing framework
- **Ethers.js**: For Web3 integration

---

**Built with ❤️ for the future of education and blockchain adoption.**
