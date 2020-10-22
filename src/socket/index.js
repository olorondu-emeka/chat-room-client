import socketIO from "socket.io-client"
let io

export default {
  init: (serverAddress) => {
    io = socketIO(serverAddress)
    return io
  },
  getIO: () => {
    if (!io) {
      throw new Error("SocketIO object not found")
    }
    return io
  },
}
