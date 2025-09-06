Next steps implemented by the backend scaffold:

- Video progress endpoint with anti-cheat heuristics: POST /api/videos/:id/progress
  Request body (JSON):
  {
    "wallet": "0x..",
    "heartbeats": [{"ts": 0, "event": "play", "positionSec": 1}, ...]
  }

- Reward issuance: issues a Transaction record and calls the configured contract using ethers.js.

Environment notes:
- Set `RPC_URL`, `PRIVATE_KEY`, and `POOL_CONTRACT_ADDRESS` in `.env` for real blockchain calls.
- For local development, if `POOL_CONTRACT_ADDRESS` is not set, reward calls return a fake tx hash.

To run locally (PowerShell):

```powershell
cd backend
pnpm install
Copy-Item .env.example .env
# edit .env to suit
pnpm run dev
```

Files added/changed:
- models: Video, Progress, Transaction
- services: antiCheatService, blockchainService (ethers)
- controllers: videoController, rewardController
- routes: videos, rewards
- package.json: added ethers
- server.js: wired new routes
