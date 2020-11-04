let socket;

const Socket = {
  init: (client) => {
    socket = client;
    return socket;
  },
  getClient: () => {
    if (!socket) {
      throw new Error("socket is not initialized");
    }
    return socket;
  },
};

export default Socket;
