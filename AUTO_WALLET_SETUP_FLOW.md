# Automatic Wallet Setup - User Experience Flow

## What Happens When You Click "Connect Wallet"

### 🔧 **AUTOMATIC PROCESS** - No Manual Setup Required

When a user clicks the "Connect Wallet" button, the following happens automatically:

### Step 1: Wallet Access
- System requests permission to connect to your wallet
- **User Action Required**: Click "Connect" in wallet popup

### Step 2: Network Detection
- System checks your current network
- If you're already on Awakening BlockDAG Testnet → Skip to Step 4
- If you're on a different network → Continue to Step 3

### Step 3: Automatic Network Switch/Add
- System attempts to switch to Awakening BlockDAG Testnet (Chain ID: 1043)
- If network doesn't exist in your wallet:
  - **User Action Required**: Click "Add Network" when prompted
  - System automatically adds all network details:
    - Network Name: Awakening BlockDAG Testnet
    - Chain ID: 1043
    - RPC URL: https://rpc.awakening.bdagscan.com/
    - Explorer: https://Awakening.bdagscan.com/
    - Currency: BDAG
- If network exists:
  - **User Action Required**: Click "Switch Network" when prompted

### Step 4: Automatic Token Addition
- System requests to add TTF token to your wallet
- **User Action Required**: Click "Add Token" when prompted (optional)
- Token details automatically filled:
  - Contract: 0xf279232dc21e14637Bd6c764a3466B93b154f89c
  - Symbol: TTF
  - Decimals: 18

### Step 5: Complete Setup
- ✅ Wallet connected
- ✅ Network switched to BlockDAG testnet
- ✅ TTF token added
- ✅ Ready to claim rewards!

## User Prompts You'll See

### 1. Connect Wallet
```
[Wallet Popup]
Connect to this site?
[Cancel] [Connect]
```

### 2. Add/Switch Network (if not on BlockDAG)
```
[Wallet Popup]
Add "Awakening BlockDAG Testnet" network?
Network Name: Awakening BlockDAG Testnet
Chain ID: 1043
RPC URL: https://rpc.awakening.bdagscan.com/
[Cancel] [Add Network]
```

### 3. Add Token (optional)
```
[Wallet Popup]
Add token to wallet?
Token: TTF
Contract: 0xf279232dc21e14637Bd6c764a3466B93b154f89c
[Cancel] [Add Token]
```

## What You Should NOT Need to Do

❌ **Manual network setup** - All parameters are added automatically
❌ **Copy/paste network details** - System fills everything
❌ **Search for token contract** - Token is added automatically
❌ **Multiple button clicks** - Everything happens from one "Connect Wallet" click

## Troubleshooting

### If Automatic Setup Doesn't Work:
1. **Manual Network Setup Guide** will appear below the wallet connection
2. All network parameters provided with copy buttons
3. Step-by-step instructions included

### If You Decline Network Switch:
- You can manually add the network later
- Use the "Switch Network" button in the Network Status section
- Or follow the manual setup guide

### If You Decline Token Addition:
- You can manually add the token later
- Use the "Add TTF Token" button when on correct network
- Token will still work for rewards even if not added to wallet

## Test Pages

To verify the automatic setup works:
- `/simple-connect` - Basic test of the connection flow
- `/wallet-test` - Detailed test with full logging
- `/rewards` - Main application page

## Expected Success Message

After successful connection, you should see:
```
✅ Wallet connected successfully! 
✅ Switched to Awakening BlockDAG Testnet, 
✅ TTF Token added to your wallet
```

The entire process should take less than 30 seconds with only 2-3 user clicks required.
