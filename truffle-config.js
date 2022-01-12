const HDWalletProvider = require('@truffle/hdwallet-provider')
require('dotenv').config()

const mnemonic = process.env.MNEMONIC
const key1 = process.env.KEY_1
const key2 = process.env.KEY_2

var privateKeys = [
    key1, key2
]

module.exports = {
  networks: {
    ganache: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*',
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
    },
  },
  compilers: {
    solc: {
      // version: '0.8.4',
      version: '0.6.6',
      settings: {
        optimizer: {
          enabled: true,
          runs: 500   // Optimize for how many times you intend to run the code
        },
      },
    },
  },
  mocha: {
    enableTimeouts: false,
    before_timeout: 240000 // Here is 2min but can be whatever timeout is suitable for you.
  }
}
