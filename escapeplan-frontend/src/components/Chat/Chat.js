import React, { useState, useEffect } from "react";
import "./Chat.css";
import Socket from "../../Socket";

function Chat(props) {
  const [socket, setSocket] = useState(Socket.getClient());

  const [name, setName] = useState(props.name);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on("chatMessage", ({ name, message }) => {
      setChat([...chat, { name, message }]);
    });
  });

  useEffect(() => {
    setName(props.name);
  }, [name]);

  const onTextChange = e => {
    setName(props.name);
    setMessage(e.target.value);
  };

  const onMessageSubmit = e => {
    e.preventDefault();
    if (message.length > 0 && name) {
      socket.emit("chatMessage", { name, message });
      setMessage("");
    }
  };

  const rendorChat = () => {
    return chat.map(({ name, message }, index) => (
      <div key={index}>
        <h3 className="fontChatSender">
          {name}: <span className="fontChatMessage"> {message} </span>
        </h3>
      </div>
    ));
  };

  return (
    <div>
      <div className="titleChat"> Chat Log </div>
      <div className="bodyChat">{rendorChat()}</div>
      <div className="inputChat">
        <form className="message" onSubmit={onMessageSubmit}>
          <input
            name="message"
            onChange={e => onTextChange(e)}
            value={message}
            placeholder="Write message ..."
          ></input>
          <button className="sendbtn">Send</button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
