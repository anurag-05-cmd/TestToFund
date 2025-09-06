const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('SkillToEarnPool', function () {
  it('issues rewards', async function () {
    const [owner, user] = await ethers.getSigners();
    const Token = await ethers.getContractFactory('BDAGToken');
    const token = await Token.deploy(ethers.utils.parseUnits('1000000', 18));
    await token.deployed();

    const Pool = await ethers.getContractFactory('SkillToEarnPool');
    const pool = await Pool.deploy(token.address);
    await pool.deployed();

    // transfer some tokens to pool admin (already owner has them), approve not needed for transfer
    // call rewardUser as admin
    const tx = await pool.rewardUser(user.address, ethers.utils.parseUnits('100', 18), 1);
    await tx.wait();

    const balance = await token.balanceOf(user.address);
    expect(balance.toString()).to.equal(ethers.utils.parseUnits('100', 18).toString());
  });
});
