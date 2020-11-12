import React from "react";

import Client from "./Client/Client";
const WaitingArea = (props) => {
  console.log("in waiting area", props.list);
  const clientList = props.list.map((client) => {
    return <Client username={client.name} clicked={props.invite} />;
  });

  return (
    <div className="waiting">
      <div className="opp">
        <h0 className="wait">Waiting for your opponents</h0>
        {clientList}
      </div>
    </div>
  );
};

export default WaitingArea;
