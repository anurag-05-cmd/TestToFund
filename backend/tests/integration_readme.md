Integration test notes:
- Use sqlite file for tests or in-memory DB
- For blockchain interactions, mock `services/blockchainService.sendReward` to return deterministic tx hashes
- Test flow: create user, seed video, POST /api/videos/:id/progress with heartbeats that pass anti-cheat, assert transaction created and status confirmed (when mocking blockchain)
