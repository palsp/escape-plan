import React from "react";

function Turn(props) {
  return (
    <div>
      <h2>
        TURN: {[" "]}
        <span>
          {props.turn ? (
            <span style={{ color: "green" }}>Warder</span>
          ) : (
            <span style={{ color: "red" }}>Prisoner</span>
          )}
        </span>
      </h2>
    </div>
  );
}

export default Turn;
