import React from "react";
import "./WaitingArea.css";
import Client from "./Client/Client";
const WaitingArea = (props) => {
  console.log("in waiting area", props.list);
  const clientList = props.list.map((client) => {
    return <Client username={client.name} clicked={props.invite} />;
  });

  return (

    <div className="new-waiting">
      <h1>Waiting for your opponents</h1>
      {clientList}
    </div>
  );
};

export default WaitingArea;
