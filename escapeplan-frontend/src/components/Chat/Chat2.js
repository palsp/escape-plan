import React, { useState, useEffect } from "react";
import "./Chat2.css";
import Socket from "../../Socket";

function Chat2(props) {
  const [socket, setSocket] = useState(Socket.getClient());

  const [name, setName] = useState(props.name);

  const [message, setMessage] = useState("hi");

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
    if (message.length > 0) {
      e.preventDefault();

      setName(name);

      socket.emit("chatMessage", { name, message });
      // setState({ message: "", name });
      setMessage("");
    } else {
      e.preventDefault();
      return;
    }
  };

  const rendorChat = () => {
    return chat.map(({ name, message }, index) => (
      <div key={index}>
        <h3>
          {name}: <span> {message} </span>
        </h3>
      </div>
    ));
  };

  return (
    <div>
      <form onSubmit={onMessageSubmit}>
        <input
          name="message"
          onChange={e => onTextChange(e)}
          value={message}
          placeholder="Write message ..."
        ></input>
        <button>>></button>
      </form>
      <div className="chat2">
        <h1>Chat Log</h1>
        {rendorChat()}
      </div>
    </div>
  );
}

export default Chat2;
