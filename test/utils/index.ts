import { ethers } from 'hardhat';

interface Spec {
  name: string;
  args?: { [s: string]: any } | ArrayLike<any>;
}

/**
 * Looks up the contract by name and deploys it with named args
 *
 * TODO: erases contract typechecking, which you get simply by doing ethers.getContractFactory('ERC20'). Use Generics
 *
 * @param {Object} spec The contract spec
 * @param {Object} spec.name The contract name to be looked up by the factory
 * @param {Object} spec.args The deployment args. Order is important, will be looped in the order they were defined
 * @returns {Object} the deployed contract
 */
export const deploy = async ({ name, args = [] }: Spec) => {
  const factory = await ethers.getContractFactory(name);
  const contract = await factory.deploy(...Object.values(args));
  await contract.deployed();

  return contract;
};

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
