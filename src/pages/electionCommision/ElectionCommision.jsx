import { useContext, useState, useEffect } from "react";
import Navigation from "../../components/navigation/Navigation";
import PropTypes from "prop-types";
import { WalletContext } from "../../components/Wallet";
import "./ElectionCommision.css";
import { toast } from "react-hot-toast";

const ElectionCommision = ({ account }) => {
  const [winnerFruit, setWinnerFruit] = useState("No Winner Yet");
  const [voteCount, setVoteCount] = useState(0);
  const { contract } = useContext(WalletContext);

  const resetVoting = async () => {
    try {
      const transaction = await contract.restartVoting();
      await transaction.wait();
      toast.success("Voting has been restarted.");
      getWinner(); // Update winner after restarting
    } catch (error) {
      console.error("Error restarting voting:", error);
    }
  };

  const getWinner = async () => {
    try {
      const winnerInfo = await contract.getWinner();
      

      console.log(winnerInfo);

      const [winnerFruit, maxVotes] = winnerInfo;
      setWinnerFruit(winnerFruit);
      setVoteCount(maxVotes.toNumber());
    } catch (error) {
      console.error("Error fetching winner:", error);
      toast.error("Error fetching winner");
    }
  };

  useEffect(() => {
    getWinner(); // Call getWinner initially when the component mounts
  }, [contract, account]);

  return (
    <div>
      <Navigation account={account} />
      <div className="election-wrapper">
        <h2>
          Winner Fruit: {winnerFruit} <br />
          Vote Count: {voteCount}
        </h2>
      </div>
      <div className="admin-actions">
        <button className="emerBtn" onClick={resetVoting}>
          Restart Voting
        </button>
      </div>
    </div>
  );
};

ElectionCommision.propTypes = {
  account: PropTypes.node.isRequired,
};

export default ElectionCommision;
