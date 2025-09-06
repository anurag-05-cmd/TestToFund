const { expect } = require("chai");
const hre = require("hardhat");

describe("SkillToEarnPool", function () {
  it("deploys token and pool, funds pool and allows owner to pay reward", async function () {
    const [deployer, user] = await hre.ethers.getSigners();
    const Token = await hre.ethers.getContractFactory("BDAGToken", deployer);
    const supply = hre.ethers.parseUnits("1000000", 18);
    const token = await Token.deploy(supply);
    await token.waitForDeployment();

    const Pool = await hre.ethers.getContractFactory("SkillToEarnPool", deployer);
    const pool = await Pool.deploy(token.target);
    await pool.waitForDeployment();

    // transfer whole supply to pool
    await token.connect(deployer).transfer(pool.target, supply);

    const poolBal = await token.balanceOf(pool.target);
    expect(poolBal).to.equal(supply);

    // owner pays reward to user
    const reward = hre.ethers.parseUnits("2000", 18);
    await pool.connect(deployer).payReward(user.address, reward);
    const userBal = await token.balanceOf(user.address);
    expect(userBal).to.equal(reward);
  });
});
