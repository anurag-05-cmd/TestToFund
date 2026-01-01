# 🎓 TestToFund - Test Trust Fund

<div align="center">

![TestToFund Logo](frontend/public/TestToFund%20Logo.svg)

**Transform your knowledge into blockchain rewards. Complete educational courses, validate your learning, and earn TTF tokens.**

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-000000?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Solidity](https://img.shields.io/badge/Solidity-^0.8.19-363636?logo=solidity)](https://soliditylang.org/)
[![BlockDAG](https://img.shields.io/badge/BlockDAG-Testnet-green)](https://Awakening.bdagscan.com/)

🌐 **[Live Demo](https://ttf.expose.software)** | 📖 **[Documentation](#documentation)** | 🚀 **[Quick Start](#quick-start)**

</div>

---

## 🎯 Project Overview

TestToFund is a revolutionary **Learn-to-Earn** platform that bridges education and blockchain technology. Users complete curated educational courses, upload completion certificates, and receive **TTF (Test To Fund)** tokens as rewards - all powered by the BlockDAG Testnet.

Built by **Team EXPOSE** during HackOdisha 5.0, this platform features cutting-edge Web3 integration, AI-powered assistance, and a comprehensive anti-cheat system to ensure legitimate learning outcomes.

### ✨ Key Features

🏆 **Learn-to-Earn System**
- Earn **2000 TTF tokens** for each completed course
- Curated collection of 20+ free Udemy courses
- Real-time certificate verification

🔐 **Advanced Web3 Integration**
- **Web3 Onboard 2.24.1** for seamless wallet connections
- Automatic BlockDAG testnet configuration
- Persistent wallet state management
- Real-time balance tracking with live updates

🤖 **TestMate AI Assistant**
- Powered by **Cohere API** for intelligent responses
- 24/7 platform support and guidance
- Team information and technical assistance
- Beautiful, responsive chat interface

🛡️ **Security & Anti-Cheat**
- Advanced certificate validation
- One-time claim system per wallet
- Blockchain-based transaction logging
- Comprehensive fraud detection algorithms

📱 **Modern User Experience**
- **Next.js 15.5.2** with App Router
- **Tailwind CSS 4.0** for responsive design
- Smooth animations with **Framer Motion**
- Professional UI with **Lucide React** icons

---

## 🏗️ Architecture Overview

```
TestToFund/
├── 🎨 frontend/                 # Next.js 15.5.2 Application
│   ├── app/                     # App Router Pages
│   │   ├── page.tsx            # Landing page with video background
│   │   ├── home/               # Course catalog & featured content
│   │   ├── rewards/            # Certificate upload & rewards claiming
│   │   ├── faucet/             # Token transfer & distribution
│   │   ├── videos/             # Video learning modules
│   │   ├── welcome/            # Wallet connection onboarding
│   │   └── api/                # Next.js API routes
│   ├── src/
│   │   ├── components/         # Reusable UI Components
│   │   │   ├── TestMate.tsx   # AI Chatbot Assistant (Cohere API)
│   │   │   ├── Navbar.tsx     # Navigation with wallet integration
│   │   │   ├── BackgroundVideo.tsx
│   │   │   ├── NetworkStatus.tsx
│   │   │   └── WalletDetection.tsx
│   │   ├── contexts/          # React Context Providers
│   │   └── lib/               # Core Libraries
│   │       ├── web3Onboard.ts # Web3 Onboard configuration
│   │       ├── web3.ts        # Blockchain interactions
│   │       └── tokenUtils.ts  # Token balance utilities
│   └── public/                # Static Assets
│       ├── TestToFund Logo.svg
│       ├── bg-video.mp4       # Animated background
│       └── TestToFund Background Text.png
│
├── ⚡ backend/                  # Express.js API Server
│   ├── server.js              # Main application entry
│   ├── config/                # Configuration
│   │   ├── database.js        # MongoDB connection
│   │   └── mongo.js           # Database initialization
│   ├── controllers/           # Request handlers
│   │   ├── authController.js  # Wallet authentication
│   │   ├── rewardController.js # Reward distribution
│   │   └── videoController.js # Video progress tracking
│   ├── models/                # Database schemas
│   │   ├── User.js           # User profiles & wallet data
│   │   ├── Video.js          # Course metadata
│   │   ├── Transaction.js    # Token distribution records
│   │   └── Progress.js       # Learning progress tracking
│   ├── services/              # Business logic
│   │   ├── blockchainService.js    # Token distribution
│   │   ├── rewardService.js        # Reward calculations
│   │   └── antiCheatService.js     # Fraud detection
│   ├── routes/                # API endpoints
│   │   ├── auth.js           # Authentication routes
│   │   ├── rewards.js        # Reward claiming
│   │   ├── videos.js         # Video management
│   │   └── admin.js          # Administrative functions
│   ├── middleware/            # Express middleware
│   │   ├── errorHandler.js   # Global error handling
│   │   └── validate.js       # Request validation
│   └── tests/                 # Test suites
│       ├── unit/             # Unit tests
│       │   └── antiCheat.test.js
│       └── integration/       # Integration tests
│           ├── auth.test.js
│           ├── progress.test.js
│           └── rewards.test.js
│
└── 📜 contracts/               # Smart Contracts (Hardhat)
    ├── hardhat.config.js      # BlockDAG testnet configuration
    ├── deployed.env           # Contract addresses
    ├── contracts/             # Solidity contracts
    │   ├── TestToFund.sol    # ERC20 TTF Token
    │   ├── TokenDistributor.sol # Reward distribution
    │   └── CertificateNFT.sol   # NFT certificates (future)
    ├── scripts/               # Deployment & utilities
    │   ├── deploy.js         # Contract deployment
    │   ├── sendTokens.js     # Token distribution testing
    │   └── verify.js         # Contract verification
    └── test/                  # Smart contract tests
        └── SkillToEarnPool.test.js
```

---

## 🚀 Technology Stack

<table>
<tr>
<td valign="top" width="33%">

### 🎨 Frontend
- **Framework**: Next.js 15.5.2 with App Router
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 4.0
- **Web3**: Web3 Onboard 2.24.1 + Ethers.js 6.13.0
- **UI**: Lucide React + Framer Motion 12.23.12
- **AI**: Cohere API integration
- **Build**: Turbopack (Next.js built-in)

</td>
<td valign="top" width="33%">

### ⚡ Backend
- **Runtime**: Node.js + Express.js 4.18.2
- **Database**: MongoDB with Mongoose 7.6.0
- **Authentication**: JWT + wallet-based auth
- **Blockchain**: Ethers.js 5.7.2
- **Validation**: Joi 17.9.2
- **Testing**: Jest 29.0.0 + Supertest 6.3.3
- **Security**: bcryptjs + rate limiting

</td>
<td valign="top" width="33%">

### 📜 Smart Contracts
- **Framework**: Hardhat 2.17.0
- **Language**: Solidity ^0.8.19
- **Libraries**: OpenZeppelin 4.9.3
- **Network**: BlockDAG Testnet
- **Tools**: Ethers.js 5.8.0
- **Testing**: Hardhat Test Suite

</td>
</tr>
</table>

### 🌐 Blockchain Network

| Parameter | Value |
|-----------|-------|
| **Network** | Awakening BlockDAG Testnet |
| **Chain ID** | 1043 |
| **RPC URL** | https://rpc.awakening.bdagscan.com/ |
| **Explorer** | https://Awakening.bdagscan.com/ |
| **Currency** | BDAG |
| **TTF Contract** | `0xf279232dc21e14637Bd6c764a3466B93b154f89c` |

---

## 🚀 Quick Start

### 📋 Prerequisites
```bash
Node.js 18+ | pnpm (recommended) | MetaMask wallet
```

### 1️⃣ Clone & Setup
```bash
git clone https://github.com/anurag-05-cmd/TestToFund.git
cd TestToFund
```

### 2️⃣ Frontend Setup
```bash
cd frontend
pnpm install

# Create environment file
cp .env.example .env.local

# Add your configuration
echo "NEXT_PUBLIC_COHERE_API_KEY=your_cohere_api_key" >> .env.local
echo "PRIVATE_KEY=your_distribution_wallet_private_key" >> .env.local
echo "TOKEN_ADDRESS=0xf279232dc21e14637Bd6c764a3466B93b154f89c" >> .env.local

# Start development server
pnpm dev
```
🌐 **Frontend**: http://localhost:3000

### 3️⃣ Backend Setup
```bash
cd backend
pnpm install

# Configure environment
cp .env.example .env

# Add MongoDB and blockchain settings
echo "MONGODB_URI=your_mongodb_connection_string" >> .env
echo "JWT_SECRET=your_jwt_secret" >> .env
echo "BLOCKCHAIN_RPC_URL=https://rpc.awakening.bdagscan.com/" >> .env

# Start server
pnpm dev
```
⚡ **Backend**: http://localhost:5000

### 4️⃣ Smart Contracts (Optional)
```bash
cd contracts
pnpm install

# Deploy to testnet (contracts already deployed)
pnpm deploy:testnet
```

---

## 💰 Token Economics

<div align="center">

| Token Details | Value |
|---------------|-------|
| **Name** | Test To Fund |
| **Symbol** | TTF |
| **Decimals** | 18 |
| **Standard** | ERC-20 |
| **Reward/Course** | 2000 TTF |
| **Network** | BlockDAG Testnet |

**Contract Address**: `0xf279232dc21e14637Bd6c764a3466B93b154f89c`

</div>

---

## 🎓 How It Works

### 👨‍🎓 For Learners

1. **🔗 Connect Wallet**
   - Connect MetaMask with automatic BlockDAG setup
   - Web3 Onboard handles seamless wallet integration

2. **📚 Browse Courses**
   - Explore 20+ curated free Udemy courses
   - Focus on Python programming & software testing

3. **🎯 Complete Learning**
   - Finish courses at your own pace
   - Obtain completion certificates from Udemy

4. **📋 Upload Certificate**
   - Submit certificates on the rewards page
   - Advanced verification system validates authenticity

5. **💰 Claim Rewards**
   - Receive 2000 TTF tokens instantly
   - Tokens sent directly to your wallet

### 🎨 Platform Features

**TestMate AI Assistant**
- Powered by Cohere API for intelligent responses
- 24/7 support for platform questions
- Team information and technical guidance
- Beautiful, mobile-responsive chat interface

**Advanced Web3 Integration**
- Web3 Onboard 2.24.1 for modern wallet connections
- Persistent connection state across page reloads
- Automatic network configuration
- Real-time balance monitoring

**Security & Anti-Cheat**
- Certificate verification algorithms
- One-time claim system per wallet
- Blockchain transaction logging
- Advanced fraud detection

---

## 📊 Course Catalog

Our platform features **20+ carefully curated free courses** across multiple categories:

<table>
<tr>
<td valign="top" width="50%">

### 🐍 Python Programming
- **Python for Beginners** - 2000 TTF
- **Introduction to Python Programming** - 2000 TTF  
- **Python from Beginner to Intermediate** - 2000 TTF
- **Python Data Structures & Algorithms** - 2000 TTF

### 🧪 Software Testing
- **Introduction to Software Testing** - 2000 TTF
- **Software Testing Simple (QA)** - 2000 TTF
- **Free Software Testing Tutorial** - 2000 TTF
- **Manual Testing Fundamentals** - 2000 TTF

</td>
<td valign="top" width="50%">

### 💻 Essential Tech Skills
- **Git & GitHub Fundamentals** - 2000 TTF
- **HTML & CSS Basics** - 2000 TTF
- **JavaScript Essentials** - 2000 TTF
- **Database Design Principles** - 2000 TTF

### 📈 Professional Development
- **Project Management Basics** - 2000 TTF
- **Productivity & Time Management** - 2000 TTF
- **Digital Marketing Fundamentals** - 2000 TTF
- **Online Business Strategies** - 2000 TTF

</td>
</tr>
</table>

*Each completed course rewards **2000 TTF tokens** upon certificate verification.*

---

## 🔗 API Reference

### 🏆 Rewards System
```http
POST /api/rewards/claim
Content-Type: application/json

{
  "wallet": "0x...",
  "certificateFile": "base64_encoded_certificate",
  "courseId": "python-beginners-001"
}
```

### 👤 User Management
```http
POST /api/auth/connect     # Connect wallet
GET  /api/auth/profile     # Get user profile  
POST /api/auth/disconnect  # Disconnect wallet
```

### 📹 Video System
```http
GET  /api/videos           # List available videos
GET  /api/videos/:id       # Get video details
POST /api/videos/:id/progress  # Track learning progress
```

### 📊 Analytics
```http
GET /api/rewards/history   # Claim history
GET /api/rewards/stats     # Platform statistics
GET /api/rewards/leaderboard  # Top learners
```

---

## 🧪 Testing & Quality Assurance

### Frontend Testing
```bash
cd frontend
pnpm test                 # Run test suite
pnpm test:coverage        # Generate coverage report
pnpm lint                 # Code quality checks
```

### Backend Testing
```bash
cd backend
pnpm test                 # Integration & unit tests
pnpm test:watch           # Watch mode
pnpm test:coverage        # Coverage analysis
```

### Smart Contract Testing
```bash
cd contracts
pnpm test                 # Hardhat test suite
pnpm coverage             # Solidity coverage
pnpm gas-report           # Gas usage analysis
```

**Test Coverage**:
- **Backend**: 90%+ test coverage with Jest
- **Smart Contracts**: 100% function coverage
- **Integration**: End-to-end user flows tested

---

## 🚀 Deployment

### 🌐 Frontend (Vercel/Netlify)
```bash
cd frontend
pnpm build
pnpm start

# Environment variables required:
# NEXT_PUBLIC_COHERE_API_KEY
# PRIVATE_KEY
# TOKEN_ADDRESS
```

### ⚡ Backend (Railway/Heroku)
```bash
cd backend
pnpm start

# Environment variables required:
# MONGODB_URI
# JWT_SECRET
# BLOCKCHAIN_RPC_URL
# PRIVATE_KEY
```

### 📜 Smart Contracts
```bash
cd contracts
pnpm deploy:testnet
pnpm verify:contracts
```

---

## 👥 Team EXPOSE

<div align="center">

Built by **Team EXPOSE** during **HackOdisha 5.0**

| Name | GitHub |
|------|--------|
| **Anurag** | [@anurag-05-cmd](https://github.com/anurag-05-cmd) |
| **Debarpriya** | [@zaxswer](https://github.com/zaxswer) |
| **Prithvi** | [@xolo978](https://github.com/xolo978) |
| **Sangram** | [@Sangram-Keshari-Patra](https://github.com/Sangram-Keshari-Patra) |


</div>

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### 📝 Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Update documentation as needed
- Follow conventional commit messages

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🛟 Support & Resources

<div align="center">

| Resource | Link |
|----------|------|
| 📖 **Documentation** | [docs/](./docs) |
| 🐛 **Bug Reports** | [GitHub Issues](https://github.com/anurag-05-cmd/TestToFund/issues) |
| 💬 **Discussions** | [GitHub Discussions](https://github.com/anurag-05-cmd/TestToFund/discussions) |
| 📧 **Email** | xpse.software@gmail.com |

</div>

---

## 🙏 Acknowledgments

Special thanks to:

- **🔗 BlockDAG Team** - For providing robust testnet infrastructure
- **📚 Udemy** - For educational content integration opportunities  
- **🛡️ OpenZeppelin** - For secure smart contract libraries
- **⚡ Next.js Team** - For the amazing React framework
- **🔧 Ethers.js** - For seamless Web3 integration
- **🤖 Cohere** - For AI-powered assistant capabilities
- **🎨 Tailwind CSS** - For beautiful, responsive design utilities

---

<div align="center">

**🚀 Ready to transform learning into earning? [Get Started Now!](https://ttf.expose.software) 🚀**

[![GitHub stars](https://img.shields.io/github/stars/anurag-05-cmd/TestToFund.svg?style=social&label=Star)](https://github.com/anurag-05-cmd/TestToFund)
[![GitHub forks](https://img.shields.io/github/forks/anurag-05-cmd/TestToFund.svg?style=social&label=Fork)](https://github.com/anurag-05-cmd/TestToFund/fork)

*Building the future of education and blockchain adoption, one course at a time.*

</div>
