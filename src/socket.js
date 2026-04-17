const { Server } = require("socket.io");

let io;

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*"
        }
    });

    io.on("connection", (socket) => {
        socket.emit("socket:ready", {
            message: "Websocket conncetion established."
        })
    });

    return io;
}

const emitTaskCreated = (task) => {
    if(!io){
        return;
    }

    io.emit("task:created", {
        message: "Websocket conncetion established.",
        data: { task }
    })
}

module.exports = { initializeSocket, emitTaskCreated };
