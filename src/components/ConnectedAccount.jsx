import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { WalletContext } from "./Wallet";

const ConnectedAccount = ({ onSwitchAccount }) => {
  const { account, signer } = useContext(WalletContext);
  const [accountAddress, setAccountAddress] = useState("");

  useEffect(() => {
    const getAccountAddress = async () => {
      try {
        const address = await signer.getAddress();
        console.log("Account Address:", address);
        setAccountAddress(address);
      } catch (error) {
        console.error("Error getting account address:", error);
      }
    };

    getAccountAddress();
  }, [signer]);

  return (
    <div>
      <p style={{ fontSize: 14, fontWeight: 400 }}>
        {`Connected Account: ${accountAddress}`}
      </p>
    </div>
  );
};

ConnectedAccount.propTypes = {
  onSwitchAccount: PropTypes.func,
};

export default ConnectedAccount;
