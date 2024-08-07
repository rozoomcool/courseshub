import { AuthenticatedSocket, socketAuthMiddleware } from "../middleware/auth_middleware";
import { Server, Socket } from "socket.io";
import { MessageRequest } from "../model/message";

const userSocketMap = new Map<string, AuthenticatedSocket>();
const userMessageMap = new Map<string, (MessageRequest & {sender: string, createdAt: string})[]>();

export const setupSocket = (io: Server) => {    
    io.use(socketAuthMiddleware)
    
    io.on('connection', async (socket: Socket) => {

        const authSocket = socket as AuthenticatedSocket;

        if (authSocket.user) {
            userSocketMap.set(authSocket.user.username, authSocket);
            if (userMessageMap.get(authSocket.user.username) && userMessageMap.get(authSocket.user.username)!.length > 0) {
                const messages = userMessageMap.get(authSocket.user.username)!;
                messages.forEach((mes) => {
                    const l_sock = userSocketMap.get(mes.recipient);
                    if (l_sock?.connected) {
                        l_sock.emit('private_message', mes)
                    }
                });
            }
            console.log(`User connected: ${authSocket.user.username}`);
        }
        console.log(`User connected: ${authSocket.user?.username}`);
        
        socket.on('private_message', async (messageRequest: MessageRequest) => {
            const targetSocket = userSocketMap.get(messageRequest.recipient);
            
            if (targetSocket?.connected) {
                targetSocket.emit('private_message', {...messageRequest, sender: authSocket.user.username, createdAt: Date().toString()});
            } else {
                if(userMessageMap.get(messageRequest.recipient)) {
                    userMessageMap.set(messageRequest.recipient, userMessageMap.get(messageRequest.recipient)!.concat({...messageRequest, sender: authSocket.user.username, createdAt: Date()}))
                } else {
                    userMessageMap.set(messageRequest.recipient, [{...messageRequest, sender: authSocket.user.username, createdAt: Date().toString()}])
                }
            }
        });
        
        socket.on('disconnect', async () => {
            userSocketMap.delete(authSocket.user.username);
            console.log(`User disconnected: ${(socket as AuthenticatedSocket).user?.username}`);
        });
    });
}