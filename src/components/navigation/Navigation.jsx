import React from "react";
import { Link } from "react-router-dom";
import "./Navigation.css";
import ConnectedAccount from "../ConnectedAccount";

const Navigation = ({ onSwitchAccount }) => {
  return (
    <header>
      <nav>
        <div className="connected-account">
          <ConnectedAccount onSwitchAccount={onSwitchAccount} />
        </div>
        <ul>
          <NavItem to="/">Home</NavItem>
          <NavItem to="/candidate">Candidate</NavItem>
          <NavItem to="/voter">Voter</NavItem>
          <NavItem to="/election-commision">Election Commission</NavItem>
        </ul>
      </nav>
    </header>
  );
};

const NavItem = ({ to, children }) => (
  <li>
    <Link className="nav-link" to={to}>
      {children}
    </Link>
  </li>
);

export default Navigation;
