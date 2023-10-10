const express = require("express");
const { ethers } = require("ethers");
const ABI = require("./ABI.json");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const SEPOLIA_URL =
  "https://eth-sepolia.g.alchemy.com/v2/lP3FHBp5OSDVl7qY36S5bTvzhaX9a2SK";

// Initialize the Ethereum provider and contract
const providerUrl = SEPOLIA_URL;
const contractAddress = "0xE58dCbbF79d86127E309E8383481A8823Ce09BFA";
const contractABI = ABI.abi;

// Connect to the Ethereum provider
const provider = new ethers.providers.JsonRpcProvider(providerUrl);

// Create an instance of the contract
const contract = new ethers.Contract(contractAddress, contractABI, provider);

// Endpoint to handle the voting process

app.post("/vote", async (req, res) => {
  try {
    const { fruitName } = req.body;
    const transactionFruits = await contract.getFruitNames(); // Assuming this structure

    // Check if the fruit already exists in the transaction
    const fruitAlreadyExists = transactionFruits.includes(fruitName);
    console.log(fruitAlreadyExists);

    if (fruitAlreadyExists) {
      res
        .status(200)
        .json({ success: true, message: `Vote for ${fruitName} successful` });
    } else {
      // Fruit does not exist, proceed with the vote

      res.status(400).json({
        success: false,
        message: `Cannot vote as it is not present in the voting contract`,
      });
    }
  } catch (error) {
    console.error("Error checking if fruit exists:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/Register", async (req, res) => {
  try {
    const { fruitName } = req.body;
    const transactionFruits = await contract.getFruitNames(); // Assuming this structure

    // Check if the fruit already exists in the transaction
    const fruitAlreadyExists = transactionFruits.includes(fruitName);
    console.log(fruitAlreadyExists);

    if (!fruitAlreadyExists) {
      res
        .status(200)
        .json({ success: true, message: `Registerd ${fruitName} successful` });
    } else {
      // Fruit does not exist, proceed with the vote

      res.status(400).json({
        success: false,
        message: `${fruitName} already exists `,
      });
    }
  } catch (error) {
    console.error("Error checking if fruit exists:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});
app.post("/getVotes", async (req, res) => {
  try {
    const { fruitName } = req.body;

    // Check if the fruit name is valid
    const votes = await contract.getVotesForFruit(fruitName);

    // Convert BigNumber to a string
    const votesString = votes.toString();

    res.status(200).json({ success: true, votes: votesString });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error getting votes" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

// Start the server
