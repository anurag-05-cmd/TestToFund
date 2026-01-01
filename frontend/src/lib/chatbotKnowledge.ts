// TestMate Knowledge Base - Local Q&A Library
// No external API needed - all responses are generated locally

export interface KnowledgeItem {
  keywords: string[];
  answer: string;
  category: 'platform' | 'technical' | 'rewards' | 'courses' | 'team' | 'blockchain' | 'wallet' | 'general';
}

export const knowledgeBase: KnowledgeItem[] = [
  // Platform Overview
  {
    keywords: ['what is testtofund', 'about platform', 'what is this', 'tell me about', 'platform', 'overview', 'explain testtofund'],
    answer: "TestToFund is a revolutionary Learn-to-Earn platform that bridges education and blockchain technology. Complete curated educational courses, upload completion certificates, and receive TTF (Test To Fund) tokens as rewards - all powered by the BlockDAG Testnet. It's built by Team EXPOSE to make learning rewarding!",
    category: 'platform'
  },
  {
    keywords: ['how does it work', 'how to use', 'how it works', 'process', 'steps', 'getting started'],
    answer: "Here's how TestToFund works:\n1. Connect your MetaMask wallet\n2. Browse our collection of 20+ free Udemy courses\n3. Complete any course at your own pace\n4. Upload your completion certificate\n5. Receive 2000 TTF tokens instantly to your wallet!\n\nEach verified certificate earns you rewards automatically.",
    category: 'platform'
  },

  // Rewards System
  {
    keywords: ['reward', 'tokens', 'how much', 'earn', 'ttf', 'reward amount', 'get paid', 'payment'],
    answer: "You earn 2000 TTF tokens for each completed course certificate! TTF (Test To Fund) tokens are distributed on the BlockDAG Testnet. Simply complete a course, upload your certificate, and the tokens are sent directly to your connected wallet. No waiting, no hassle!",
    category: 'rewards'
  },
  {
    keywords: ['claim', 'how to claim', 'claiming rewards', 'receive tokens', 'get tokens', 'redeem'],
    answer: "To claim your rewards:\n1. Complete any course from our catalog\n2. Get your completion certificate from Udemy\n3. Go to the Rewards page on TestToFund\n4. Connect your wallet (if not already connected)\n5. Upload your certificate URL\n6. Click 'Claim Rewards'\n\nYour 2000 TTF tokens will be sent immediately after verification!",
    category: 'rewards'
  },
  {
    keywords: ['certificate', 'upload certificate', 'proof', 'verification', 'verify', 'validate'],
    answer: "We verify certificates to ensure legitimate learning. Upload your Udemy certificate URL on the Rewards page. Our system validates it using advanced anti-cheat measures. Each wallet can claim once per certificate to prevent fraud. Make sure your certificate is from one of our approved courses!",
    category: 'rewards'
  },

  // Courses
  {
    keywords: ['courses', 'what courses', 'available courses', 'course list', 'catalog', 'learn'],
    answer: "We offer 20+ free curated courses in multiple categories:\n\n🐍 Python Programming - Beginner to Advanced\n🧪 Software Testing - QA & Manual Testing\n💻 Essential Tech - Git, HTML, CSS, JavaScript\n📈 Professional Development - Project Management, Marketing\n\nEach course rewards 2000 TTF tokens upon completion. Visit the Home page to browse all courses!",
    category: 'courses'
  },
  {
    keywords: ['python course', 'python', 'programming', 'coding'],
    answer: "We have several Python courses available:\n- Python for Beginners (2000 TTF)\n- Introduction to Python Programming (2000 TTF)\n- Python from Beginner to Intermediate (2000 TTF)\n- Python Data Structures & Algorithms (2000 TTF)\n\nAll are free Udemy courses, perfect for anyone wanting to learn Python while earning rewards!",
    category: 'courses'
  },
  {
    keywords: ['testing course', 'software testing', 'qa', 'quality assurance'],
    answer: "Our Software Testing courses include:\n- Introduction to Software Testing (2000 TTF)\n- Software Testing Simple QA (2000 TTF)\n- Free Software Testing Tutorial (2000 TTF)\n- Manual Testing Fundamentals (2000 TTF)\n\nPerfect for aspiring QA engineers and testers!",
    category: 'courses'
  },
  {
    keywords: ['free courses', 'cost', 'price', 'payment', 'paid'],
    answer: "All our courses are completely FREE! We've curated 20+ free Udemy courses. You don't pay anything - instead, we PAY YOU 2000 TTF tokens for each course you complete. It's truly learn-to-earn!",
    category: 'courses'
  },

  // Wallet & Blockchain
  {
    keywords: ['wallet', 'metamask', 'connect wallet', 'web3', 'connection'],
    answer: "Connect your MetaMask wallet to receive rewards! Our platform uses Web3 Onboard for seamless wallet integration. When you connect, we automatically configure the BlockDAG Testnet for you. Your wallet stays connected across all pages, and you can view your balance in real-time.",
    category: 'wallet'
  },
  {
    keywords: ['blockdag', 'blockchain', 'network', 'testnet', 'chain'],
    answer: "TestToFund runs on BlockDAG Testnet:\n- Network: Awakening BlockDAG Testnet\n- Chain ID: 1043\n- RPC URL: https://rpc.awakening.bdagscan.com/\n- Currency: BDAG\n- Explorer: https://Awakening.bdagscan.com/\n\nThe network and TTF token are automatically added when you connect your wallet!",
    category: 'blockchain'
  },
  {
    keywords: ['bdag', 'gas fees', 'transaction fee', 'native token'],
    answer: "BDAG is the native token for the BlockDAG Testnet. You need a small amount of BDAG for transaction fees (gas). You can get free BDAG from the faucet at: https://Awakening.bdagscan.com/faucet?chain=EVM\n\nDon't worry - gas fees are minimal on the testnet!",
    category: 'blockchain'
  },
  {
    keywords: ['faucet', 'send tokens', 'transfer ttf', 'token transfer'],
    answer: "Our Faucet page lets you:\n1. Get free BDAG tokens for gas fees\n2. Send TTF tokens to other wallets\n\nSimply connect your wallet, enter the recipient address, and specify the amount. Perfect for sharing your earned TTF with friends!",
    category: 'blockchain'
  },
  {
    keywords: ['contract address', 'token address', 'ttf address', 'smart contract'],
    answer: "TTF Token Contract Address: 0xf279232dc21e14637Bd6c764a3466B93b154f89c\n\nToken Details:\n- Name: Test To Fund\n- Symbol: TTF\n- Decimals: 18\n- Standard: ERC-20\n- Network: BlockDAG Testnet\n\nView on explorer: https://Awakening.bdagscan.com/",
    category: 'blockchain'
  },

  // Team EXPOSE
  {
    keywords: ['team', 'who built', 'developers', 'creators', 'expose', 'team expose', 'who made'],
    answer: "TestToFund was built by Team EXPOSE during HackOdisha 5.0:\n\n👨‍💻 Anurag - @anurag-05-cmd\n👨‍💻 Debapriya - @zaxswer\n👨‍💻 Prithvi - @xolo978\n👨‍💻 Sangram - @Sangram-Keshari-Patra\n\nWe're passionate about combining education with blockchain to create meaningful learning experiences!",
    category: 'team'
  },
  {
    keywords: ['anurag', 'who is anurag', 'team member anurag'],
    answer: "Anurag is a core team member of Team EXPOSE and one of the developers behind TestToFund. You can find him on GitHub at @anurag-05-cmd. He's passionate about blockchain technology and education!",
    category: 'team'
  },
  {
    keywords: ['debapriya', 'who is debapriya', 'team member debapriya'],
    answer: "Debapriya is a key member of Team EXPOSE who helped build TestToFund. Find him on GitHub at @zaxswer. He's dedicated to creating innovative learning solutions!",
    category: 'team'
  },
  {
    keywords: ['prithvi', 'who is prithvi', 'team member prithvi'],
    answer: "Prithvi is part of Team EXPOSE and contributed to developing TestToFund. You can find him on GitHub at @xolo978. He's committed to bridging education and technology!",
    category: 'team'
  },
  {
    keywords: ['sangram', 'who is sangram', 'team member sangram'],
    answer: "Sangram is a vital member of Team EXPOSE who worked on TestToFund. Find him on GitHub at @Sangram-Keshari-Patra. He's passionate about blockchain innovation!",
    category: 'team'
  },
  {
    keywords: ['hackodisha', 'hackathon', 'competition'],
    answer: "TestToFund was developed during HackOdisha 5.0, a premier hackathon event! Team EXPOSE built this platform to showcase how blockchain and education can work together to create real value for learners.",
    category: 'team'
  },

  // Technical Details
  {
    keywords: ['technology', 'tech stack', 'built with', 'technologies', 'framework'],
    answer: "TestToFund is built with cutting-edge technologies:\n- Next.js 15.5.2 (Frontend)\n- TypeScript 5.0\n- Web3 Onboard 2.24.1 (Wallet Integration)\n- Ethers.js 6.13.0 (Blockchain)\n- Solidity ^0.8.19 (Smart Contracts)\n- Tailwind CSS (Styling)\n- MongoDB (Database)\n\nAll running on BlockDAG Testnet!",
    category: 'technical'
  },
  {
    keywords: ['web3 onboard', 'wallet integration', 'persistent connection'],
    answer: "We use Web3 Onboard 2.24.1 for seamless wallet connections! Features include:\n- Automatic wallet detection\n- Persistent connection across pages\n- Automatic network configuration\n- Real-time balance updates\n- Support for multiple wallets\n\nYour wallet stays connected even after page refreshes!",
    category: 'technical'
  },
  {
    keywords: ['security', 'anti-cheat', 'fraud', 'safe', 'secure'],
    answer: "Security is our priority! TestToFund includes:\n✅ Advanced certificate verification\n✅ One-time claim per wallet per certificate\n✅ Blockchain transaction logging\n✅ Anti-cheat algorithms\n✅ Fraud detection systems\n\nYour learning rewards are protected and legitimate!",
    category: 'technical'
  },

  // General Questions
  {
    keywords: ['help', 'support', 'issue', 'problem', 'error', 'not working'],
    answer: "I'm here to help! Common solutions:\n\n- Wallet not connecting? Make sure MetaMask is installed\n- Can't claim rewards? Check that you uploaded the correct certificate URL\n- No BDAG for gas? Visit the faucet to get free testnet tokens\n- Need more help? Check our documentation or ask me specific questions!\n\nWhat specific issue are you facing?",
    category: 'general'
  },
  {
    keywords: ['testmate', 'who are you', 'what are you', 'ai', 'assistant', 'chatbot'],
    answer: "I'm TestMate, your friendly AI learning assistant for TestToFund! I'm here 24/7 to help you with questions about courses, rewards, blockchain, wallet connections, and anything else related to our platform. Feel free to ask me anything!",
    category: 'general'
  },
  {
    keywords: ['thank', 'thanks', 'appreciate'],
    answer: "You're welcome! I'm always here to help. If you have any more questions about TestToFund, courses, or earning TTF tokens, feel free to ask. Happy learning! 🎓",
    category: 'general'
  },
  {
    keywords: ['hello', 'hi', 'hey', 'greetings'],
    answer: "Hello! 👋 Welcome to TestToFund! I'm TestMate, your learning assistant. I can help you with:\n- Understanding how the platform works\n- Finding courses to earn rewards\n- Connecting your wallet\n- Claiming your TTF tokens\n\nWhat would you like to know?",
    category: 'general'
  },

  // Live Demo & Links
  {
    keywords: ['demo', 'website', 'link', 'url', 'live'],
    answer: "You can access TestToFund at: https://ttf.expose.software\n\nOur platform is live and ready for you to start earning! Connect your wallet and begin your learn-to-earn journey today!",
    category: 'platform'
  },
  {
    keywords: ['github', 'source code', 'repository', 'code'],
    answer: "TestToFund is open source! Find our code on GitHub:\nhttps://github.com/anurag-05-cmd/TestToFund\n\nWe welcome contributions from the community. Feel free to star the repo and check out how we built this amazing platform!",
    category: 'platform'
  },
  {
    keywords: ['explorer', 'transactions', 'view transaction', 'block explorer'],
    answer: "View all TestToFund transactions on the BlockDAG Explorer:\nhttps://Awakening.bdagscan.com/\n\nYou can track your TTF token transfers, check balances, and verify all blockchain activity. Total transparency!",
    category: 'blockchain'
  }
];

// Default fallback responses for unmatched queries
export const fallbackResponses = [
  "I'm not sure I understand that question. Could you rephrase it? I can help with courses, rewards, wallets, blockchain, or our team!",
  "That's an interesting question! I specialize in helping with TestToFund platform questions. Try asking about courses, claiming rewards, or how to get started!",
  "I don't have specific information about that. But I can help you with:\n- Available courses and rewards\n- How to connect your wallet\n- Claiming TTF tokens\n- Platform features\n\nWhat would you like to know?",
  "Hmm, I'm not sure about that. Ask me about TestToFund courses, earning TTF tokens, blockchain details, or our Team EXPOSE members!",
];

// Function to find best matching answer
export function findBestMatch(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase().trim();
  
  // Check for exact or close keyword matches
  let bestMatch: KnowledgeItem | null = null;
  let highestScore = 0;
  
  for (const item of knowledgeBase) {
    let score = 0;
    
    for (const keyword of item.keywords) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        // Give higher score for exact matches and longer keyword matches
        score += keyword.length;
      }
    }
    
    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }
  
  // Return best match if found, otherwise return random fallback
  if (bestMatch && highestScore > 0) {
    return bestMatch.answer;
  }
  
  // Return a random fallback response
  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
}

// Quick response suggestions
export const quickResponses = [
  "How does TestToFund work?",
  "What courses are available?",
  "How do I claim rewards?",
  "Tell me about Team EXPOSE",
  "How much can I earn?",
  "How to connect wallet?"
];
