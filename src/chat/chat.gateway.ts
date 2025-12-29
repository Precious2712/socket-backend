import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
    cors: {
        origin: [
            'https://socket-io-frontend-teal.vercel.app',
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:3002',
        ],
        credentials: true,
    },
})

export class ChatGateway
    implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    // userId -> socketId
    private onlineUsers = new Map<string, string>();

    constructor(private readonly chatService: ChatService) { }

    handleConnection(socket: Socket) {
        console.log('Socket connected:', socket.id);
    }

    handleDisconnect(socket: Socket) {
        for (const [userId, socketId] of this.onlineUsers.entries()) {
            if (socketId === socket.id) {
                this.onlineUsers.delete(userId);
                this.server.emit('userOffline', userId);
                break;
            }
        }

        console.log('Socket disconnected:', socket.id);
    }

    // 1️⃣ Register user when frontend connects
    @SubscribeMessage('registerUser')
    handleRegisterUser(
        @MessageBody() userId: string,
        @ConnectedSocket() socket: Socket,
    ) {
        this.onlineUsers.set(userId, socket.id);
        this.server.emit('userOnline', userId);
    }

    // 2️⃣ Join private room (A <-> B)
    @SubscribeMessage('joinRoom')
    handleJoinRoom(
        @MessageBody()
        data: { senderId: string; receiverId: string },
        @ConnectedSocket() socket: Socket,
    ) {
        const roomId = [data.senderId, data.receiverId].sort().join('-');
        socket.join(roomId);
    }

    // 3️⃣ Load chat history
    @SubscribeMessage('loadMessages')
    async handleLoadMessages(
        @MessageBody()
        data: { senderId: string; receiverId: string },
        @ConnectedSocket() socket: Socket,
    ) {
        const messages = await this.chatService.getConversation(
            data.senderId,
            data.receiverId,
        );

        socket.emit('chatHistory', messages);
    }

    // 4️⃣ Send message
    @SubscribeMessage('sendMessage')
    async handleSendMessage(
        @MessageBody()
        data: {
            senderId: string;
            senderName: string;
            receiverId: string;
            receiverName: string;
            message: string;
        },
    ) {
        const roomId = [data.senderId, data.receiverId].sort().join('-');

        const savedMessage = await this.chatService.saveMessage(
            data.senderId,
            data.senderName,
            data.receiverId,
            data.receiverName,
            data.message,
        );

        // send to both users in room
        this.server.to(roomId).emit('receiveMessage', savedMessage);
    }

    @SubscribeMessage('markAsSeen')
    async markSeen(
        @MessageBody() data: { senderId: string; receiverId: string },
    ) {
        await this.chatService.markMessagesAsSeen(
            data.senderId,
            data.receiverId,
        );

        const roomId = [data.senderId, data.receiverId].sort().join('-');
        this.server.to(roomId).emit('messagesSeen', data.senderId);
    }
}
