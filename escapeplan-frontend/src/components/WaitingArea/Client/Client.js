import React from "react";

const Client = (props) => {
  return (
    <div>
      <label>
        <h1>{props.username}</h1>
        <button onClick={() => props.clicked(props.username)}>Invite</button>
      </label>
    </div>
  );
};

export default Client;
