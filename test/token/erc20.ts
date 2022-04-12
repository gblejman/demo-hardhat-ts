import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ZERO_ADDRESS } from '../utils';
import { ERC20 } from '../../typechain';

export const deploy = async (
  name: string,
  symbol: string,
  decimals: number,
  totalSupply: number
) => {
  const factory = await ethers.getContractFactory('ERC20');
  const contract = await factory.deploy(name, symbol, decimals, totalSupply);
  await contract.deployed();

  return contract;
};

describe('ERC20', () => {
  const name = 'GDB Token';
  const symbol = 'GDB';
  const decimals = 18;
  const totalSupply = 1000000;

  let contract: ERC20;

  // some handly addresses to interact with
  let owner: SignerWithAddress;
  let account1: SignerWithAddress;
  let account2: SignerWithAddress;

  beforeEach(async () => {
    [owner, account1, account2] = await ethers.getSigners();
    contract = await deploy(name, symbol, decimals, totalSupply);
  });

  describe('constructor()', () => {
    it('Should assign totalSupply to contract owner', async () => {
      expect(await contract.name()).to.equal(name);
      expect(await contract.symbol()).to.equal(symbol);
      expect(await contract.totalSupply()).to.equal(totalSupply);
      expect(await contract.balanceOf(owner.address)).to.equal(totalSupply);
      expect(await contract.balanceOf(account1.address)).to.equal(0);
    });

    it('Should fail if token name is empty', async () => {
      const name = '';
      const symbol = 'GDB';
      const decimals = 18;
      const totalSupply = 1000000;

      await expect(
        deploy(name, symbol, decimals, totalSupply)
      ).to.be.revertedWith('Token name must not be empty');
    });

    it('Should fail if symbol name is empty', async () => {
      const name = 'GDB Token';
      const symbol = '';
      const decimals = 18;
      const totalSupply = 1000000;

      await expect(
        deploy(name, symbol, decimals, totalSupply)
      ).to.be.revertedWith('Token symbol must not be empty');
    });

    it('Should fail if decimals is greater than 18', async () => {
      const name = 'GDB Token';
      const symbol = 'GDB';
      const decimals = 19;
      const totalSupply = 1000000;

      await expect(
        deploy(name, symbol, decimals, totalSupply)
      ).to.be.revertedWith('Token decimals must be between 0 and 18');
    });

    it('Should fail if total supply is empty', async () => {
      const name = 'GDB Token';
      const symbol = 'GDB';
      const decimals = 18;
      const totalSupply = 0;

      await expect(
        deploy(name, symbol, decimals, totalSupply)
      ).to.be.revertedWith('Token total supply must be positive');
    });
  });

  describe('transfer()', () => {
    it('Should succeed if caller has sufficient balance', async () => {
      const from = owner;
      const to = account1;
      const amount = 10;

      expect(await contract.balanceOf(from.address)).to.equal(totalSupply);
      expect(await contract.balanceOf(to.address)).to.equal(0);

      await expect(contract.transfer(to.address, amount))
        .to.emit(contract, 'Transfer')
        .withArgs(from.address, to.address, amount);

      expect(await contract.balanceOf(from.address)).to.equal(
        totalSupply - amount
      );
      expect(await contract.balanceOf(to.address)).to.equal(amount);
    });

    it('Should fail if to address is the zero address', async () => {
      const to = ZERO_ADDRESS;
      const amount = 10;

      await expect(contract.transfer(to, amount)).to.be.revertedWith(
        'To address can not be the zero address'
      );
    });

    it('Should fail if caller has insufficient balance', async () => {
      const from = account1;
      const to = account2;
      const amount = 10;

      expect(await contract.balanceOf(from.address)).to.equal(0);
      await expect(
        contract.connect(account1).transfer(to.address, amount)
      ).to.be.revertedWith('Insufficient balance');
    });
  });

  describe('allowance()', () => {
    it('Should retrieve spender allowance', async () => {
      const from = owner;
      const spender = account1;

      expect(await contract.allowance(from.address, spender.address)).to.equal(
        0
      );
    });
  });

  describe('approve()', () => {
    it('Should set the amount the spender is allowed to withdraw', async () => {
      const from = owner;
      const spender = account1;
      const amount = 10;

      expect(await contract.allowance(from.address, spender.address)).to.equal(
        0
      );

      await expect(contract.approve(spender.address, amount))
        .to.emit(contract, 'Approval')
        .withArgs(from.address, spender.address, amount);

      expect(await contract.allowance(from.address, spender.address)).to.equal(
        amount
      );
    });
  });

  describe('transferFrom()', () => {
    it('Should allow spender to transfer amount', async () => {
      const from = owner;
      const spender = account1;
      const to = account2;
      const amount = 10;

      expect(await contract.balanceOf(from.address)).to.equal(totalSupply);
      expect(await contract.balanceOf(to.address)).to.equal(0);

      expect(await contract.allowance(from.address, spender.address)).to.equal(
        0
      );

      await expect(contract.approve(spender.address, amount))
        .to.emit(contract, 'Approval')
        .withArgs(from.address, spender.address, amount);

      expect(await contract.allowance(from.address, spender.address)).to.equal(
        amount
      );

      await expect(
        contract.connect(spender).transferFrom(from.address, to.address, amount)
      )
        .to.emit(contract, 'Transfer')
        .withArgs(from.address, to.address, amount);

      expect(await contract.balanceOf(from.address)).to.equal(
        totalSupply - amount
      );
      expect(await contract.balanceOf(to.address)).to.equal(amount);

      expect(await contract.allowance(from.address, spender.address)).to.equal(
        0
      );
    });
  });
});
