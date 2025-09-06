// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
}

contract SkillToEarnPool {
    address public admin;
    IERC20 public token;

    event RewardIssued(address indexed to, uint256 amount, uint256 indexed id);

    constructor(address tokenAddress) {
        admin = msg.sender;
        token = IERC20(tokenAddress);
    }

    function rewardUser(address to, uint256 amount, uint256 id) external returns (bool) {
        require(msg.sender == admin, "only_admin");
        require(token.transfer(to, amount), "transfer_failed");
        emit RewardIssued(to, amount, id);
        return true;
    }
}
