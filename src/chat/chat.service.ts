import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Chat } from './schema/chat-schema';

@Injectable()
export class ChatService {
    constructor(@InjectModel(Chat.name) private chatModel: Model<Chat>) {}

    async saveMessage(
        senderId: string,
        senderName: string,
        receiverId: string,
        receiverName: string,
        message: string,
    ) {
        const chat = new this.chatModel({
            senderId: new Types.ObjectId(senderId),
            senderName,
            receiverId: new Types.ObjectId(receiverId),
            receiverName,
            message,
        });

        return chat.save();
    }


    async getConversation(senderId: string, receiverId: string) {
        const senderObjectId = new Types.ObjectId(senderId);
        const receiverObjectId = new Types.ObjectId(receiverId);

        return this.chatModel
            .find({
                $or: [
                    { senderId: senderObjectId, receiverId: receiverObjectId },
                    { senderId: receiverObjectId, receiverId: senderObjectId },
                ],
            })
            .sort({ createdAt: 1 })
            .exec();
    }

    async markMessagesAsSeen(senderId: string, receiverId: string) {
        return this.chatModel.updateMany(
            {
                senderId: new Types.ObjectId(receiverId),
                receiverId: new Types.ObjectId(senderId),
                seen: false,
            },
            { seen: true },
        );
    }


}
