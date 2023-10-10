// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract FruitVoting {
    // Struct to store fruit details: name and votes
    struct FruitDetails {
        string fruitName;
        uint votes;
    }

    // Array to store the names of fruits
    string[] public fruitNames;

    // Mapping to store the number of votes for each fruit
    mapping(string => uint) public fruitVotes;

    // The name of the winning fruit
    string public winnerFruit;

    // The maximum number of votes among all fruits
    uint public maxVotes = 0;

    // Address of the contract owner
    address public owner;

    // Event emitted when a fruit is voted for
    event FruitVoted(string indexed fruit, uint votes);

    // Event emitted when a winner is announced
    event WinnerAnnounced(string winner, uint votes);

    // Event emitted when voting is restarted
    event VoteRestarted();

    // Event emitted when a new fruit is added
    event FruitAdded(string fruit);

    // Modifier to restrict function access to the contract owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    // Constructor to initialize the contract and add initial fruit names
    constructor() {
        owner = msg.sender;

        fruitNames.push("Apple");
        fruitNames.push("Banana");
        fruitNames.push("Cherry");

        for (uint i = 0; i < fruitNames.length; i++) {
            fruitVotes[fruitNames[i]] = 0;
        }
    }

    // Function to allow a user to vote for a fruit
    function voteForFruit(string memory fruit) public {
        require(bytes(fruit).length > 0, "Fruit name cannot be empty");
        require(isValidFruit(fruit), "Invalid fruit");

        fruitVotes[fruit]++;

        emit FruitVoted(fruit, fruitVotes[fruit]);

        if (fruitVotes[fruit] > maxVotes) {
            maxVotes = fruitVotes[fruit];
            winnerFruit = fruit;
            emit WinnerAnnounced(winnerFruit, maxVotes);
        }
    }

    // Function to get the number of votes for a specific fruit
    function getVotesForFruit(string memory fruit) public view returns (uint) {
        require(bytes(fruit).length > 0, "Fruit name cannot be empty");
        require(isValidFruit(fruit), "Invalid fruit");

        return fruitVotes[fruit];
    }

    // Function to get the winner fruit and its number of votes
    function getWinner() public view returns (string memory, uint) {
        return (winnerFruit, maxVotes);
    }

    // Function to get the array of fruit names
    function getFruitNames() public view returns (string[] memory) {
        return fruitNames;
    }

    // Function to restart the voting, resetting votes and winner information
    function restartVoting() public onlyOwner {
        require(fruitNames.length > 3, "No extra fruits to remove.");

        for (uint i = 0; i < 3; i++) {
            fruitVotes[fruitNames[i]] = 0;
        }

        for (uint i = fruitNames.length - 1; i >= 3; i--) {
            deleteFruit(i);
        }

        winnerFruit = "";
        maxVotes = 0;

        emit VoteRestarted();
    }

    // Function to delete a fruit from the array of fruit names
    function deleteFruit(uint index) internal {
        if (index < fruitNames.length) {
            for (uint i = index; i < fruitNames.length - 1; i++) {
                fruitNames[i] = fruitNames[i + 1];
            }
            fruitNames.pop();
        }
    }

    // Function to add a new fruit to the array of fruit names
    function addFruit(string memory newFruit) public {
        require(bytes(newFruit).length > 0, "Fruit name cannot be empty");
        require(!isValidFruit(newFruit), "Fruit already exists");

        fruitNames.push(newFruit);
        fruitVotes[newFruit] = 0;

        emit FruitAdded(newFruit);
    }

    // Function to check if a given fruit is valid (exists in the array)
    function isValidFruit(string memory fruit) private view returns (bool) {
        for (uint i = 0; i < fruitNames.length; i++) {
            if (keccak256(bytes(fruitNames[i])) == keccak256(bytes(fruit))) {
                return true;
            }
        }
        return false;
    }
}
