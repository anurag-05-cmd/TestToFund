async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with', deployer.address);

  const Token = await ethers.getContractFactory('BDAGToken');
  const token = await Token.deploy(ethers.utils.parseUnits('1000000', 18));
  await token.deployed();
  console.log('Token deployed to', token.address);

  const Pool = await ethers.getContractFactory('SkillToEarnPool');
  const pool = await Pool.deploy(token.address);
  await pool.deployed();
  console.log('Pool deployed to', pool.address);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
