import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ChatGateway {
    @WebSocketServer()
    server: Server;

    constructor(private chatService: ChatService) {}

    handleConnection(socket: Socket) {
        console.log('User connected:', socket.id);
    }

    handleDisconnect(socket: Socket) {
        console.log('User disconnected:', socket.id);
    }

    @SubscribeMessage('sendMessage')
    async handleMessage(
        @MessageBody()
        data: { senderId: string; receiverId: string; message: string },
        @ConnectedSocket() socket: Socket,
    ) {
        // Save message to MongoDB
        const savedMessage = await this.chatService.saveMessage(
            data.senderId,
            data.receiverId,
            data.message,
        );

        // Emit to everyone else except sender
        socket.broadcast.emit('receiveMessage', savedMessage);
    }
}