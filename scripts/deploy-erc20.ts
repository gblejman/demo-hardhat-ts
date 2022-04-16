import { ethers } from 'hardhat';

async function main() {
  const name = 'GDB Token';
  const symbol = 'GDB';
  const decimals = 18;
  const totalSupply = ethers.BigNumber.from(10).pow(18).mul(1000);
  // another way to do it, should total units come from UI as a string:
  //const totalSupply = ethers.utils.parseUnits('100', decimals);

  const factory = await ethers.getContractFactory('ERC20');
  const contract = await factory.deploy(name, symbol, decimals, totalSupply);

  await contract.deployed();

  console.log('Contract deployed to:', contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
