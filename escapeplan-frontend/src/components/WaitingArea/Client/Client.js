import React from "react";

const Client = (props) => {
  return (
    <div>
      <label>
        <h1>{props.username}</h1>
        {/* <button onClick={props.clicked}>Invite</button> */}
        <button>Invite</button>
      </label>
    </div>
  );
};

export default Client;
