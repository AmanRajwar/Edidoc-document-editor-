import { Server as SocketServer } from "socket.io";

const setupSocket = (server: any) => {

    const io = new SocketServer(server, {
        cors: {
            origin: 'http://localhost:5173',
            credentials: true,
        }
    })

    const userSocketMap = new Map();

    const disconnect = (socket: any) => {
        console.log(`client disconnected : ${socket.id} `)
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                break;
            }
        }
    }


    const handleEditDocument = (data: any) => {
        data.collaborators.map((collaborator: any) => {
            const socketId = userSocketMap.get(collaborator.user);
            if (socketId) {
                io.to(socketId).emit('documentEdited', data.data); 
            }
        })
    }

    io.on('connection', (socket) => {
        const userId = socket.handshake.query.userId

        if (userId) {
            userSocketMap.set(userId, socket.id)
            console.log(` User Connected : ${userId} with socket ID: ${socket.id}`)
        } else {
            console.log('User id not provided during connection')
        }

        socket.on('disconnect', (socket) => disconnect(socket))
        socket.on('editDocument', (data) => handleEditDocument(data))
    })

}

export default setupSocket