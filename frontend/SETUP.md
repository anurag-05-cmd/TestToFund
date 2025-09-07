# TTF Token Distribution Setup

## Quick Setup Instructions

1. **Update Environment Variables**
   - Edit the `.env.local` file in the frontend folder
   - Add your private key (the wallet that will distribute tokens):
   ```
   PRIVATE_KEY=your_actual_private_key_here
   RPC_URL=https://primordial.bdagscan.com/rpc
   TOKEN_ADDRESS=0x1fC39F5a1497C042A47054D94c6f473e39598853
   REWARD_AMOUNT=2000
   ```

2. **Fund the Distribution Wallet**
   - Make sure the wallet (private key owner) has sufficient TTF tokens
   - Each claim will send 2000 TTF tokens to users

3. **Start the Application**
   ```bash
   cd frontend
   pnpm run dev
   ```

4. **How It Works**
   - Users connect their wallet on `/rewards` page
   - They upload Udemy certificate or provide certificate URL
   - Backend automatically sends 2000 TTF tokens to their wallet
   - Transaction hash and explorer link are provided
   - Each wallet can only claim once

## Security Notes
- Never commit your private key to version control
- Use a dedicated distribution wallet with limited funds
- Consider implementing rate limiting in production
- Store claimed addresses in a database for production use

## Transaction Details
- Network: BDAG Testnet
- Explorer: https://primordial.bdagscan.com
- Gas fees are paid by the distribution wallet
- Token contract: 0x1fC39F5a1497C042A47054D94c6f473e39598853
