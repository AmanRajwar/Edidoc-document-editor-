"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const setupSocket = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: 'http://localhost:5173',
            credentials: true,
        }
    });
    const userSocketMap = new Map();
    const disconnect = (socket) => {
        console.log(`client disconnected : ${socket.id} `);
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                break;
            }
        }
    };
    const handleEditDocument = (data) => {
        data.collaborators.map((collaborator) => {
            const socketId = userSocketMap.get(collaborator.user);
            if (socketId) {
                io.to(socketId).emit('documentEdited', data.data);
            }
        });
    };
    io.on('connection', (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log(` User Connected : ${userId} with socket ID: ${socket.id}`);
        }
        else {
            console.log('User id not provided during connection');
        }
        socket.on('disconnect', (socket) => disconnect(socket));
        socket.on('editDocument', (data) => handleEditDocument(data));
    });
};
exports.default = setupSocket;
