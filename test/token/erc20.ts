import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';

import { deploy, ZERO_ADDRESS } from '../utils';

describe('ERC20', () => {
  const spec = {
    name: 'ERC20',
    args: {
      name: 'GDB Token',
      symbol: 'GDB',
      decimals: 18,
      totalSupply: 1000000,
    },
  };

  // TODO: what should the ts type be?
  let contract: any;

  // some handly addresses to interact with
  let owner: SignerWithAddress;
  let account1: SignerWithAddress;
  let account2: SignerWithAddress;

  beforeEach(async () => {
    [owner, account1, account2] = await ethers.getSigners();
    contract = await deploy(spec);
  });

  describe('constructor()', () => {
    it('Should assign totalSupply to contract owner', async () => {
      const spec = {
        name: 'ERC20',
        args: {
          name: 'GDB Token',
          symbol: 'GDB',
          decimals: 18,
          totalSupply: 1000000,
        },
      };
      const [owner, account1] = await ethers.getSigners();
      const contract = await deploy(spec);

      expect(await contract.name()).to.equal(spec.args.name);
      expect(await contract.symbol()).to.equal(spec.args.symbol);
      expect(await contract.totalSupply()).to.equal(spec.args.totalSupply);
      expect(await contract.balanceOf(owner.address)).to.equal(
        spec.args.totalSupply
      );
      expect(await contract.balanceOf(account1.address)).to.equal(0);
    });

    it('Should fail if token name is empty', async () => {
      let spec = {
        name: 'ERC20',
        args: { name: '', symbol: 'GDB', decimals: 18, totalSupply: 1000000 },
      };

      await expect(deploy(spec)).to.be.revertedWith(
        'Token name must not be empty'
      );
    });

    it('Should fail if symbol name is empty', async () => {
      let spec = {
        name: 'ERC20',
        args: {
          name: 'GDB Token',
          symbol: '',
          decimals: 18,
          totalSupply: 1000000,
        },
      };

      await expect(deploy(spec)).to.be.revertedWith(
        'Token symbol must not be empty'
      );
    });

    it('Should fail if decimals is greater than 18', async () => {
      let spec = {
        name: 'ERC20',
        args: {
          name: 'GDB Token',
          symbol: 'GDB',
          decimals: 19,
          totalSupply: 1000000,
        },
      };

      await expect(deploy(spec)).to.be.revertedWith(
        'Token decimals must be between 0 and 18'
      );
    });

    it('Should fail if total supply is empty', async () => {
      let spec = {
        name: 'ERC20',
        args: {
          name: 'GDB Token',
          symbol: 'GDB',
          decimals: 18,
          totalSupply: 0,
        },
      };

      await expect(deploy(spec)).to.be.revertedWith(
        'Token total supply must be positive'
      );
    });
  });

  describe('transfer()', () => {
    it('Should succeed if sender has sufficient balance', async () => {
      const totalSupply = spec.args.totalSupply;
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

    it('Should fail if sender has insufficient balance', async () => {
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
      const totalSupply = spec.args.totalSupply;

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

      console.log(
        'allow',
        await contract.allowance(from.address, spender.address)
      );
      expect(await contract.allowance(from.address, spender.address)).to.equal(
        0
      );
    });
  });
});
