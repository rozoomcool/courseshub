import { AuthenticatedSocket, socketAuthMiddleware } from "../middleware/auth_middleware";
import { Server, Socket } from "socket.io";
import { MessageRequest } from "../model/message";
import { chatService } from "../service/chat_service";
import { MessageStatus } from "@prisma/client";

const userSocketMap = new Map<number, AuthenticatedSocket>();


export const setupSocket = (io: Server) => {    
    io.use(socketAuthMiddleware)
    
    io.on('connection', async (socket: Socket) => {

        const authSocket = socket as AuthenticatedSocket;

        if (authSocket.user) {
            userSocketMap.set(authSocket.user.id, authSocket);
            console.log(`User connected: ${authSocket.user.username}`);
        }
        console.log(`User connected: ${authSocket.user?.username}`);
        
        socket.on('private_message', async (messageRequest: MessageRequest) => {
            const targetSocket = userSocketMap.get(messageRequest.recipientId);

            const chat = await chatService.getChatOrCreate({
                userOneId: messageRequest.recipientId,
                userTwoId: authSocket.user.id
            });

            const message = await chatService.createMessage({
                senderId: authSocket.user.id,
                chatId: chat.id,
                content: messageRequest.content
            })
            
            if (targetSocket?.connected) {
                const delivered = targetSocket.emit('private_message', message);
                if (delivered){
                    authSocket.emit('message_delivered', {messageId: message.id, status: MessageStatus.DELIVERED});
                    chatService.chageMessageStatus({messageId: message.id, status: MessageStatus.DELIVERED})
                }
            }
        });
        
        socket.on('disconnect', async () => {
            userSocketMap.delete(authSocket.user.id);
            console.log(`User disconnected: ${(socket as AuthenticatedSocket).user?.username}`);
        });
    });
}