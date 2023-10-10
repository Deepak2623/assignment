require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  solidity: "0.8.19",
  networks: {
    sepholia: {
      url: process.env.SEPOLIA_URL,

      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
