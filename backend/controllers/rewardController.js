const rewardService = require('../services/rewardService');

async function issueReward(user, amount, meta = {}) {
  // Delegate to rewardService to keep controller thin
  return rewardService.issueRewardForUser(user, amount, meta);
}

module.exports = { issueReward };
