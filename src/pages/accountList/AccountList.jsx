import React, { useEffect, useContext, useState } from "react";
import PropTypes from "prop-types";
import { WalletContext } from "../../components/Wallet";
import Navigation from "../../components/navigation/Navigation";
import "./AccountList.css";
import toast from "react-hot-toast";

const AccountList = ({ saveAccount }) => {
  const { contract } = useContext(WalletContext);
  const [fruitNames, setFruitNames] = useState([]);
  const [selectedFruit, setSelectedFruit] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (contract) {
          const voterDetails = await contract.getFruitNames();
          setFruitNames(voterDetails);
        }
      } catch (error) {
        console.error("Error fetching voter details:", error);
      }
    };
    fetchData();
  }, [contract]);

  // const handleVote = async () => {
  //   try {
  //     if (!selectedFruit) {
  //       console.error("Please select a fruit.");
  //       return;
  //     }

  //     setLoading(true); // Show the loading GIF

  //     const transaction = await contract.voteForFruit(selectedFruit);
  //     await transaction.wait();

  //     setLoading(false); // Hide the loading GIF

  //     alert(`Vote successful for ${selectedFruit}`);

  //     // Reload the window after successful vote
  //     window.location.reload();
  //   } catch (error) {
  //     console.error("Error voting:", error);
  //     setLoading(false); // Hide the loading GIF in case of an error
  //   }
  // };
  const handleVote = async () => {
    try {
      if (!selectedFruit) {
        console.error("Please select a fruit.");
        return;
      }

      setLoading(true); // Show the loading GIF

      // Call the API to vote for the selected fruit
      const apiEndpoint = "http://assignment-blockchain.vercel.app/vote";
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fruitName: selectedFruit }),
      };

      const response = await fetch(apiEndpoint, requestOptions);
      const data = await response.json();
      console.log(data);

      if (response.ok) {
        const transaction = await contract.voteForFruit(selectedFruit);
        await transaction.wait();

        setLoading(false); // Hide the loading GIF
        toast.success(`Vote successful for ${selectedFruit}`);
        setSelectedFruit("");
        // Reload the window after successful vote
      } else {
        console.error("Error voting:", data.error);
        setLoading(false); // Hide the loading GIF in case of an error
      }
    } catch (error) {
      console.error("Error voting:", error);
      setLoading(false); // Hide the loading GIF in case of an error
    }
  };

  return (
    <div className="ac-list-wrapper">
      <Navigation account={selectedAccount} />
      <div className="ac-list-container">
        <img src="/vote.gif" alt="voteGIF" autoPlay width={240} />
        <h1 className="ac-list-title">
          Revolutionalitised <span className="span">voting system</span>
          <br />
          through blockchain
        </h1>

        <label htmlFor="fruitDropdown">Select a fruit:</label>
        <select
          id="fruitDropdown"
          value={selectedFruit}
          onChange={(e) => setSelectedFruit(e.target.value)}
          style={{
            fontSize: "20px",
            padding: "15px",
            backgroundColor: "#f0f0f0",
            color: "#333",
            border: "1px solid #ccc",
            borderRadius: "8px",
            width: "45%", // Adjust the width to 100% for a larger appearance
            cursor: "pointer",
          }}
        >
          <option value="" disabled>
            Select a fruit
          </option>
          {fruitNames.map((fruit, index) => (
            <option key={index} value={fruit}>
              {fruit.length > 20 ? `${fruit.slice(0, 20)}...` : fruit}
            </option>
          ))}
        </select>

        <div>
          {loading ? (
            <img src="/loading.gif" alt="Loading" />
          ) : (
            <button
              className="regBtn"
              onClick={handleVote}
              style={{ fontSize: "18px" }}
            >
              Vote
            </button>
          )}
        </div>

        <p className="note">*Go to Menu: Register for New candidate</p>
      </div>
    </div>
  );
};

AccountList.propTypes = {
  saveAccount: PropTypes.func.isRequired,
};

export default AccountList;
