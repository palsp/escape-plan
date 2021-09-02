import React from "react";

import "./Invite.css";

const Invite = (props) => {
  return (
    <div className="invitebox">
      <h1 className="invitetext">Invite friends</h1>

      <div className="player">
        <h1 className="invitetext">prim</h1>
        <br></br>
        <button className="myButton">Invite</button>
      </div>

      <h1>Loading spinner</h1>
      <div id="loading"></div>
    </div>
  );
};

export default Invite;
