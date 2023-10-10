import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import "./Vote.css";
import { toast } from "react-hot-toast";
import { WalletContext } from "../Wallet";

const Vote = ({ account }) => {
  const { contract } = useContext(WalletContext);
  const [fruitNames, setFruitNames] = useState([]);
  const [selectedFruit, setSelectedFruit] = useState("");
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

  const handleVote = async () => {
    try {
      if (!selectedFruit) {
        console.error("Please select a fruit.");
        return;
      }

      setLoading(true);

      // Call the API to get the vote count for the selected fruit
      const apiEndpoint = "http://localhost:3000/getVotes"; 
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fruitName: selectedFruit }),
      };

      const response = await fetch(apiEndpoint, requestOptions);
      const data = await response.json();

      if (response.ok) {
        toast.success(`Vote count for ${selectedFruit}: ${data.votes}`);

        setLoading(false); // Hide the loading GIF
        // Reload the window after successful registration
      } else {
        console.error("Error getting vote count:", data.error);
        setLoading(false); // Hide the loading GIF in case of an error
      }
    } catch (error) {
      console.error("Error voting:", error);
      setLoading(false);
      toast.error("Vote Failed");
    }
  };

  return (
    <div className="ac-list-wrapper">
      <div className="ac-list-container">
        <h1 className="ac-list-title">
          <span className="span">Get Votes</span>
          <br />
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
            width: "45%",
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

Vote.propTypes = {
  account: PropTypes.node.isRequired,
};

export default Vote;
