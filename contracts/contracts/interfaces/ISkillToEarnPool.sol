// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ISkillToEarnPool {
    function rewardUser(address to, uint256 amount, uint256 id) external returns (bool);
}
