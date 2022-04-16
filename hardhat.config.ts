import * as dotenv from 'dotenv';

import { HardhatUserConfig, task } from 'hardhat/config';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'solidity-coverage';

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const ropstenUrl = process.env.INFURA_ROPSTEN_URL;
const deployerAccountKey = process.env.DEPLOYER_ACCOUNT_KEY;
const reportGas = process.env.REPORT_GAS;
const etherscanApiKey = process.env.ETHERSCAN_API_KEY;

const config: HardhatUserConfig = {
  solidity: '0.8.4',
  networks: {
    // hardhat localhost
    hardhat: {
      chainId: 1337,
    },
    ropsten: {
      url: ropstenUrl,
      accounts: deployerAccountKey !== undefined ? [deployerAccountKey] : [],
    },
  },
  gasReporter: {
    enabled: reportGas !== undefined,
    currency: 'USD',
  },
  etherscan: {
    apiKey: etherscanApiKey,
  },
};

export default config;
