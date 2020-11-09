import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./Chat.css";

const socket = io.connect("http://localhost:5000");

function Chat() {
  const [state, setState] = useState({ message: "", name: "" });
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on("chatMessage", ({ name, message }) => {
      setChat([...chat, { name, message }]);
    });
  });

  const onTextChange = e => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const onMessageSubmit = e => {
    e.preventDefault();
    const { name, message } = state;
    socket.emit("chatMessage", { name, message });
    setState({ message: "", name });
  };

  const renderChat = () => {
    return chat.map(({ name, message }, index) => (
      <div key={index}>
        <h3>
          {name}: <span>{message}</span>
        </h3>
      </div>
    ));
  };

  return (
    <div className="card">
      <form onSubmit={onMessageSubmit}>
        <h1>Messenger</h1>
        <div className="name-field">
          <input
            name="name"
            onChange={e => onTextChange(e)}
            value={state.name}
          ></input>
        </div>
        <div>
          <input
            name="message"
            onChange={e => onTextChange(e)}
            value={state.message}
          ></input>
        </div>
        <button>Send Message</button>
      </form>
      <div className="rendor-chat">
        <h1>Chat Log</h1>
        {renderChat()}
      </div>
    </div>
  );
}

export default Chat;
