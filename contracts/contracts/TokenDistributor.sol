// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WalletPoolDistributor is Ownable {
    IERC20 public immutable token;

    event RewardSent(address indexed to, uint256 amount);

    constructor(address tokenAddress) {
        require(tokenAddress != address(0), "token==0");
        token = IERC20(tokenAddress);
    }

    /// @notice Send rewards directly from the owner wallet (your wallet is the pool)
    function sendReward(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "invalid to");
        require(amount > 0, "amount>0");

        // Pull tokens from owner wallet (pool)
        bool ok = token.transferFrom(owner(), to, amount);
        require(ok, "transfer failed");

        emit RewardSent(to, amount);
    }
}
