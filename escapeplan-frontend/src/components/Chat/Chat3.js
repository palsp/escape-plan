import React, { useState, useEffect } from "react";
// import Socket from "../../Socket";

import io from "socket.io-client";

const socket = io.connect("http://localhost:5000");
function Chat3() {
  //   const [socket, setSocket] = useState(Socket.getClient());

  const [message, setMessage] = useState("hi");

  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on("chatMessage", ({ name, message }) => {
      setChat([...chat, message]);
    });
  });

  const onSubmitMessage = e => {
    e.preventDefault();

    let name = "dummy name";
    socket.emit("chatMessage", { name, message });
  };

  const onMessageChange = e => {
    setMessage(e.target.value);
  };

  const rendorChatt = () => {
    return chat.map(msg => <h1>BirdLnwZa007: {msg}</h1>);
  };
  return (
    <div>
      <form onSubmit={onSubmitMessage}>
        <input
          onChange={e => onMessageChange(e)}
          value={message}
          placeholder="Write message.."
        ></input>
        <button>>>>></button>
      </form>

      <div>
        <h1>Chat Logg</h1>
        {rendorChatt()}
      </div>
    </div>
  );
}

export default Chat3;
