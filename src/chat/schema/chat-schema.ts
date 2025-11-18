import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Chat extends Document {
    @Prop({ type: Types.ObjectId, ref: 'Singnup', required: true })
    senderId: Types.ObjectId;

    @Prop({
        required: true
    })
    senderName: string;

    @Prop({ type: Types.ObjectId, ref: 'Singnup', required: true })
    receiverId: Types.ObjectId;

    @Prop({
        required: true
    })
    receiverName: string;

    @Prop({ required: true })
    message: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);