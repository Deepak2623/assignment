import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import CandidateDisplay from "../../components/candidateDisplay/CandidateDisplay";
import Navigation from "../../components/navigation/Navigation";
import { WalletContext } from "../../components/Wallet";
import "./CandidateRegister.css";
import { toast } from "react-hot-toast";

const CandidateRegister = ({ account }) => {
  const { contract } = useContext(WalletContext);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [displayUpdated, setDisplayUpdated] = useState(false);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const candidateRegistration = async (event) => {
    event.preventDefault();

    try {
      if (!name) {
        toast.error("Please enter a name.");
        return;
      }

      setLoading(true); // Show loading indicator

      const apiEndpoint = "http://assignment-blockchain.vercel.app/Register";
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      };

      const response = await fetch(apiEndpoint, requestOptions);
      const data = await response.json();

      if (response.ok) {
        const transaction = await contract.addFruit(name);
        await transaction.wait();

        toast.success(`${name} registered successfully`);

        setLoading(false); // Hide loading indicator
        setName(""); // Reload the window after successful registration
        setDisplayUpdated(!displayUpdated);
      } else {
        toast.error(`Already Taken: ${name}`);
        console.error("Error registering candidate:", data.error);
        setLoading(false); // Hide loading indicator in case of an error
      }
    } catch (error) {
      console.error("Error registering candidate:", error);
      toast.error(`Already Taken: ${name}`);
      setLoading(false); // Hide loading indicator in case of an error
    }
  };

  return (
    <>
      <Navigation account={account} />
      <div className="reg-cand-wrapper">
        <div className="reg-img-wrapper">
          <h1>Welcome to Candidate Register</h1>
          <p>Make your votes count towards the candidate you like</p>
          <img src="/register.png" width={300} alt="Register" />
        </div>
        <form className="can-reg-form" onSubmit={candidateRegistration}>
          <h3>Register</h3>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
          />

          <button className="regBtn" type="submit">
            {loading ? "Registering..." : "Register"}
          </button>
          {loading && (
            <div className="loading-spinner">
              <img src="/loading.gif" alt="Loading" />
            </div>
          )}
        </form>
      </div>
      <CandidateDisplay key={displayUpdated} />
    </>
  );
};

CandidateRegister.propTypes = {
  account: PropTypes.node.isRequired,
};

export default CandidateRegister;
