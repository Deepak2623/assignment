import { useContext } from "react";
import PropTypes from "prop-types";
import Navigation from "../../components/navigation/Navigation";
import { WalletContext } from "../../components/Wallet";
import VoterDisplay from "../../components/voterDisplay/VoterDisplay";
import Vote from "../../components/vote/Vote";

import "./VoterRegister.css";
import toast from "react-hot-toast";

const VoterRegister = ({ account }) => {
  return (
    <>
      <Navigation account={account} />
      <div className="status-nav"></div>
      <div className="voter-reg-wrapper ">
        <Vote account={account} />
      </div>
    </>
  );
};
VoterRegister.propTypes = {
  account: PropTypes.node.isRequired,
};
export default VoterRegister;
