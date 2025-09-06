# Skill-to-Earn Microgrants Project Structure

## Project Root Structure
```
skill-to-earn-platform/
├── README.md
├── .gitignore
├── package.json
├── .env.example
├── docker-compose.yml
├── contracts/
│   ├── hardhat.config.js
│   ├── package.json
│   ├── .env.example
│   ├── scripts/
│   │   ├── deploy.js
│   │   ├── verify.js
│   │   └── populate-pool.js
│   ├── contracts/
│   │   ├── SkillToEarnPool.sol
│   │   ├── BDAGToken.sol
│   │   └── interfaces/
│   │       └── ISkillToEarnPool.sol
│   ├── test/
│   │   ├── SkillToEarnPool.test.js
│   │   └── helpers/
│   │       └── testHelpers.js
│   └── artifacts/
├── backend/
│   ├── package.json
│   ├── .env.example
│   ├── server.js
│   ├── config/
│   │   ├── database.js
│   │   ├── blockchain.js
│   │   └── redis.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Progress.js
│   │   ├── Video.js
│   │   ├── Question.js
│   │   └── Transaction.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── videoController.js
│   │   ├── quizController.js
│   │   ├── githubController.js
│   │   ├── rewardController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── rateLimiter.js
│   │   ├── videoMonitoring.js
│   │   ├── antiCheat.js
│   │   └── validation.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── videos.js
│   │   ├── quiz.js
│   │   ├── github.js
│   │   ├── rewards.js
│   │   └── admin.js
│   ├── services/
│   │   ├── blockchainService.js
│   │   ├── githubService.js
│   │   ├── emailService.js
│   │   ├── videoService.js
│   │   └── antiCheatService.js
│   ├── utils/
│   │   ├── logger.js
│   │   ├── encryption.js
│   │   ├── validation.js
│   │   └── constants.js
│   ├── database/
│   │   ├── migrations/
│   │   │   ├── 001_create_users.sql
│   │   │   ├── 002_create_progress.sql
│   │   │   ├── 003_create_videos.sql
│   │   │   ├── 004_create_questions.sql
│   │   │   └── 005_create_transactions.sql
│   │   └── seeds/
│   │       ├── videos.sql
│   │       └── questions.sql
│   └── tests/
│       ├── unit/
│       │   ├── controllers/
│       │   ├── services/
│       │   └── utils/
│       └── integration/
│           ├── auth.test.js
│           ├── video.test.js
│           └── rewards.test.js
├── frontend/
│   ├── package.json
│   ├── .env.example
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── tsconfig.json
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── logo.svg
│   │   ├── images/
│   │   │   ├── hero-bg.jpg
│   │   │   ├── feature-icons/
│   │   │   └── testimonials/
│   │   └── videos/
│   │       ├── course-1.mp4
│   │       ├── course-2.mp4
│   │       └── course-3.mp4
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── Layout.tsx
│   │   │   │   ├── LoadingSpinner.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   └── Toast.tsx
│   │   │   ├── web3/
│   │   │   │   ├── WalletConnect.tsx
│   │   │   │   ├── NetworkSwitcher.tsx
│   │   │   │   ├── TokenBalance.tsx
│   │   │   │   └── TransactionStatus.tsx
│   │   │   ├── video/
│   │   │   │   ├── SecureVideoPlayer.tsx
│   │   │   │   ├── VideoProgress.tsx
│   │   │   │   ├── AntiCheatOverlay.tsx
│   │   │   │   └── VideoControls.tsx
│   │   │   ├── quiz/
│   │   │   │   ├── QuizContainer.tsx
│   │   │   │   ├── QuestionCard.tsx
│   │   │   │   ├── ScoreDisplay.tsx
│   │   │   │   └── QuizTimer.tsx
│   │   │   ├── github/
│   │   │   │   ├── GitHubSubmission.tsx
│   │   │   │   ├── RepoInstructions.tsx
│   │   │   │   └── ProjectValidation.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── DashboardOverview.tsx
│   │   │   │   ├── ProgressTracker.tsx
│   │   │   │   ├── RewardHistory.tsx
│   │   │   │   └── ProfileStats.tsx
│   │   │   └── home/
│   │   │       ├── HeroSection.tsx
│   │   │       ├── FeaturesSection.tsx
│   │   │       ├── HowItWorks.tsx
│   │   │       ├── Testimonials.tsx
│   │   │       └── CallToAction.tsx
│   │   ├── pages/
│   │   │   ├── index.tsx
│   │   │   ├── dashboard.tsx
│   │   │   ├── learn/
│   │   │   │   ├── video/[id].tsx
│   │   │   │   └── quiz/[id].tsx
│   │   │   ├── github-submission.tsx
│   │   │   ├── profile.tsx
│   │   │   ├── rewards.tsx
│   │   │   └── _app.tsx
│   │   ├── hooks/
│   │   │   ├── useWeb3.ts
│   │   │   ├── useAuth.ts
│   │   │   ├── useProgress.ts
│   │   │   ├── useRewards.ts
│   │   │   ├── useVideoPlayer.ts
│   │   │   └── useAntiCheat.ts
│   │   ├── context/
│   │   │   ├── Web3Context.tsx
│   │   │   ├── AuthContext.tsx
│   │   │   ├── ProgressContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── blockchain.ts
│   │   │   ├── video.ts
│   │   │   ├── quiz.ts
│   │   │   └── github.ts
│   │   ├── utils/
│   │   │   ├── constants.ts
│   │   │   ├── helpers.ts
│   │   │   ├── validation.ts
│   │   │   ├── formatters.ts
│   │   │   └── antiCheat.ts
│   │   ├── types/
│   │   │   ├── user.ts
│   │   │   ├── video.ts
│   │   │   ├── quiz.ts
│   │   │   ├── blockchain.ts
│   │   │   └── api.ts
│   │   └── styles/
│   │       ├── globals.css
│   │       ├── components.css
│   │       └── animations.css
│   └── tests/
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       └── utils/
├── shared/
│   ├── types/
│   │   ├── common.ts
│   │   ├── blockchain.ts
│   │   └── api.ts
│   ├── constants/
│   │   ├── blockchain.ts
│   │   ├── api.ts
│   │   └── messages.ts
│   └── utils/
│       ├── validation.ts
│       └── formatters.ts
├── docs/
│   ├── API.md
│   ├── DEPLOYMENT.md
│   ├── SMART_CONTRACTS.md
│   ├── SECURITY.md
│   ├── TESTING.md
│   └── USER_GUIDE.md
├── scripts/
│   ├── setup.sh
│   ├── deploy-contracts.sh
│   ├── seed-database.sh
│   └── build-production.sh
└── monitoring/
    ├── docker/
    │   ├── prometheus/
    │   │   └── prometheus.yml
    │   └── grafana/
    │       └── dashboards/
    ├── alerts/
    │   └── rules.yml
    └── logs/
        └── .gitkeep
```

## Key File Descriptions

### Smart Contracts (`/contracts/`)
- **SkillToEarnPool.sol**: Main contract managing token pool and rewards distribution
- **BDAGToken.sol**: BDAG token implementation (if needed for testing)
- **ISkillToEarnPool.sol**: Interface for the main contract
- **deploy.js**: Deployment script for BlockDAG testnet
- **verify.js**: Contract verification script

### Backend (`/backend/`)
- **server.js**: Express.js server entry point
- **authController.js**: Wallet authentication and user management
- **videoController.js**: Video streaming and progress tracking
- **quizController.js**: MCQ management and scoring
- **githubController.js**: GitHub integration and project validation
- **rewardController.js**: Token reward distribution logic
- **antiCheat.js**: Anti-cheat detection and monitoring
- **blockchainService.js**: Web3 interactions with BlockDAG network

### Frontend (`/frontend/`)
- **SecureVideoPlayer.tsx**: Custom video player with anti-cheat features
- **WalletConnect.tsx**: Web3 wallet connection component
- **QuizContainer.tsx**: Interactive quiz interface
- **GitHubSubmission.tsx**: GitHub project submission form
- **DashboardOverview.tsx**: Main user dashboard
- **HeroSection.tsx**: Landing page hero section
- **useAntiCheat.ts**: Hook for monitoring user behavior

### Security Features
- **videoMonitoring.js**: Backend middleware for video behavior tracking
- **AntiCheatOverlay.tsx**: Frontend component preventing dev tools
- **antiCheatService.js**: Service for detecting suspicious activities
- **rateLimiter.js**: API rate limiting middleware

### Database Schema
- **Users**: Wallet addresses, progress, suspension status
- **Progress**: Video completion, quiz scores, GitHub submissions
- **Videos**: Course content metadata
- **Questions**: MCQ questions and correct answers
- **Transactions**: Reward distribution records

### Configuration Files
- **hardhat.config.js**: Hardhat configuration for BlockDAG testnet
- **next.config.js**: Next.js configuration
- **tailwind.config.js**: Dark theme Tailwind CSS configuration
- **docker-compose.yml**: Development environment setup

### Monitoring & Testing
- **Prometheus/Grafana**: Application monitoring
- **Unit/Integration tests**: Comprehensive test coverage
- **API documentation**: Complete API reference
- **Security documentation**: Security best practices guide

## Blockchain Integration Points
- **RPC URL**: rpc.primordial.bdagscan.com
- **Token Pool**: 1,000,000 BDAG tokens
- **Reward Amount**: 2000 BDAG per completion
- **Network**: BlockDAG Testnet (EVM Compatible)
- **Contract Events**: All transactions logged on-chain

## Anti-Cheat Mechanisms
- **Video Monitoring**: Detects skipping, dev tools, tab switching
- **Progress Validation**: Server-side verification of completion
- **Account Suspension**: Automatic suspension for violations
- **Quiz Integrity**: Randomized questions, time limits
- **GitHub Verification**: Repository and commit validation