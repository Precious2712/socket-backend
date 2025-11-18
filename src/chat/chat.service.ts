import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Chat } from './schema/chat-schema';

@Injectable()
export class ChatService {
    constructor(@InjectModel(Chat.name) private chatModel: Model<Chat>) { }

    async saveMessage(senderId: string, receiverId: string, message: string) {
        const chat = new this.chatModel({
            senderId: new Types.ObjectId(senderId),
            receiverId: new Types.ObjectId(receiverId),
            message,
        });
        return chat.save();
    }

    async getMessages(senderId: string, receiverId: string) {
        return this.chatModel
            .find({
                $or: [
                    { senderId, receiverId },
                    { senderId: receiverId, receiverId: senderId },
                ],
            })
            .sort({ createdAt: 1 })
            .exec();
    }

    async getConversation(senderId: string, receiverId: string) {
        return this.chatModel.find({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId },
            ],
        }).sort({ createdAt: 1 });
    }

}
