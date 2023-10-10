import { useState, useEffect, createContext } from "react";
import PropTypes from "prop-types";
import { ethers } from "ethers";
import ABI from "./ABI.json";
import { Web3Provider } from "@ethersproject/providers";

const WalletContext = createContext();

const Wallet = ({ children }) => {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });

  useEffect(() => {
    const init = async () => {
      // Check if Metamask is available
      if (typeof window.ethereum !== "undefined") {
        try {
          // Create a new ethers provider using Metamask's provider
          const provider = new Web3Provider(window.ethereum); // Use Web3Provider

          // Request access to the user's accounts
          await window.ethereum.request({ method: "eth_requestAccounts" });

          // Get the signer from the provider
          const signer = provider.getSigner();

          // Contract address and ABI
          const contractAddress = "0xE58dCbbF79d86127E309E8383481A8823Ce09BFA";

          // Create contract instance
          const contract = new ethers.Contract(
            contractAddress,
            ABI.abi,
            signer
          );

          // Set the state with provider, signer, and contract instances
          setState({ provider, signer, contract });
        } catch (error) {
          console.error("Error initializing Metamask:", error);
        }
      } else {
        console.error("Metamask is not installed or not available");
      }
    };

    init();
  }, []);

  return (
    <WalletContext.Provider value={state}>{children}</WalletContext.Provider>
  );
};

Wallet.propTypes = {
  children: PropTypes.node.isRequired,
};

export { WalletContext };
export default Wallet;
