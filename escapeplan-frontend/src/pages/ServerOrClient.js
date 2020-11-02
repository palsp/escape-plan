import React from "react";
import "../App.css";

function ServerOrClient({ history }) {
  const onClickHandler1 = () => {
    history.push("/");
  };
  const onClickHandler2 = () => {
    history.push("/gamearea");
  };

  return (
    <div>
      <button
        style={{ width: "100px", height: "50px" }}
        onClick={onClickHandler1}
      >
        <h2>back</h2>
      </button>
      <div className="center">
        <button onClick={onClickHandler2}>Server</button>
        <button onClick={onClickHandler2}>Client</button>
      </div>
    </div>
  );
}

export default ServerOrClient;
