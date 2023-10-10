import React, { useState, useEffect, useContext } from "react";
import { WalletContext } from "../Wallet";
import "./CandidateDisplay.css";

const CandidateDisplay = () => {
  const { contract } = useContext(WalletContext);
  const [fruitNames, setFruitNames] = useState([]);

  useEffect(() => {
    const fetchFruitNames = async () => {
      try {
        // Call the contract's getFruitNames function to retrieve fruit names
        const names = await contract.getFruitNames();
        setFruitNames(names);
      } catch (error) {
        console.error("Error fetching fruit names:", error);
      }
    };

    // Check if contract is available before fetching data
    contract && fetchFruitNames();
  }, [contract]);

  if (fruitNames.length === 0) {
    return null;
  }

  return (
    <div className="table-container">
      <table className="voter-table">
        <thead>
          <tr>
            <th>Fruit Name</th>
          </tr>
        </thead>
        <tbody>
          {fruitNames.map((fruitName, index) => (
            <tr key={index}>
              <td>{fruitName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CandidateDisplay;
