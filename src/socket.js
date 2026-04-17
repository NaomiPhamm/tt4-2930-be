const { Server } = require("socket.io");

let io;

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*"
        }
    });

    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);

        socket.emit("socket:ready", {
            message: "Websocket connection established."
        });

        socket.on("disconnect", () => {
            console.log("Socket disconnected:", socket.id);
        });
    });

    return io;
};

const emitTaskCreated = (task) => {
    if (!io) return;

    io.emit("task:created", {
        data: { task }
    });
};

const emitTaskUpdated = (task) => {
    if (!io) return;

    io.emit("task:updated", {
        data: { task }
    });
};

const emitTaskDeleted = (taskId) => {
    if (!io) return;

    io.emit("task:deleted", {
        data: { id: taskId }
    });
};

module.exports = {
    initializeSocket,
    emitTaskCreated,
    emitTaskUpdated,
    emitTaskDeleted
};