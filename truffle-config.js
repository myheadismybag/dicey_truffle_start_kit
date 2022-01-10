const HDWalletProvider = require('@truffle/hdwallet-provider')
require('dotenv').config()

const mnemonic = process.env.MNEMONIC
const url = process.env.RPC_URL
const key1 = process.env.KEY_1
const key2 = process.env.KEY_2

var privateKeys = [
    key1, key2
]

module.exports = {
  networks: {
    cldev: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*',
    },
    ganache: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*',
    },
    binance_testnet: {
      provider: () => new HDWalletProvider(mnemonic,'https://data-seed-prebsc-1-s1.binance.org:8545'),
      network_id: 97,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    kovan: {
      provider: () => {
        // return new HDWalletProvider(privateKeys, `wss://eth-kovan.alchemyapi.io/v2/${process.env.ALCHEMY_ID}`, 0, 1)
        return new HDWalletProvider(privateKeys, `https://eth-kovan.alchemyapi.io/v2/${process.env.ALCHEMY_ID}`, 0, 1)
        // return new HDWalletProvider(privateKeys, `https://kovan.infura.io/v3/${process.env.INFURA_ID}`, 0, 1)
        //return new HDWalletProvider(privateKeys, `wss://kovan.infura.io/ws/v3/${process.env.INFURA_ID}`, 0, 1)
      },
      network_id: '42',
      skipDryRun: true,
      // gas: 5000000,
      // gasPrice: 45000000000,
      confirmations: 2,
      timeoutBlocks: 200,
      websocket: true,
      timeoutBlocks: 50000,
      networkCheckTimeout: 1000000      
    },
  },
  compilers: {
    solc: {
      // version: '0.8.4',
      version: '0.6.6',
      // Solution 1. Turn on solidity optimization
      settings: {
        evmVersion: 'byzantium', // Default: "petersburg"
        optimizer: {
          enabled: true,
          runs: 1500
        }
      }
    },
  },
  mocha: {
    enableTimeouts: false,
    before_timeout: 240000 // Here is 2min but can be whatever timeout is suitable for you.
  }
}
