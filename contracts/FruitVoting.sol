// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract FruitVoting {
    struct FruitDetails {
        string fruitName;
        uint votes;
    }

    string[] public fruitNames;
    mapping(string => uint) public fruitVotes;
    string public winnerFruit;
    uint public maxVotes = 0;
    address public owner;

    event FruitVoted(string indexed fruit, uint votes);
    event WinnerAnnounced(string winner, uint votes);
    event VoteRestarted();
    event FruitAdded(string fruit);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;

        fruitNames.push("Apple");
        fruitNames.push("Banana");
        fruitNames.push("Cherry");

        for (uint i = 0; i < fruitNames.length; i++) {
            fruitVotes[fruitNames[i]] = 0;
        }
    }

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

    function getVotesForFruit(string memory fruit) public view returns (uint) {
        require(bytes(fruit).length > 0, "Fruit name cannot be empty");
        require(isValidFruit(fruit), "Invalid fruit");

        return fruitVotes[fruit];
    }

    function getWinner() public view returns (string memory, uint) {
        return (winnerFruit, maxVotes);
    }

    function getFruitNames() public view returns (string[] memory) {
        return fruitNames;
    }

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

    function deleteFruit(uint index) internal {
        if (index < fruitNames.length) {
            for (uint i = index; i < fruitNames.length - 1; i++) {
                fruitNames[i] = fruitNames[i + 1];
            }
            fruitNames.pop();
        }
    }

    function addFruit(string memory newFruit) public {
        require(bytes(newFruit).length > 0, "Fruit name cannot be empty");
        require(!isValidFruit(newFruit), "Fruit already exists");

        fruitNames.push(newFruit);
        fruitVotes[newFruit] = 0;

        emit FruitAdded(newFruit);
    }

    function isValidFruit(string memory fruit) private view returns (bool) {
        for (uint i = 0; i < fruitNames.length; i++) {
            if (keccak256(bytes(fruitNames[i])) == keccak256(bytes(fruit))) {
                return true;
            }
        }
        return false;
    }
}
