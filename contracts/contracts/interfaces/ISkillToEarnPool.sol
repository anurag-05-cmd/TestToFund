// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ISkillToEarnPool {
    function fundPool(uint256 amount) external;
    function withdraw(address to, uint256 amount) external;
    function token() external view returns (IERC20);
}