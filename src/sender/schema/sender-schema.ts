import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Singnup } from "src/auth/schema/auth-schema";

@Schema({ timestamps: true })
export class Sender {
    @Prop({ type: Types.ObjectId, ref: Singnup.name, required: true })
    senderId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: Singnup.name, required: true })
    receiverId: Types.ObjectId;

    @Prop({
        required: true,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    })
    status: string;

    // Normalized pair → ensures only ONE request between two users.
    @Prop({ required: true })
    pair: string;

    @Prop({ required: true })
    senderFirstName: string;

    @Prop({ required: true })
    senderLastName: string;

    @Prop({ required: true })
    senderGender: string;

    @Prop({ default: 1 })
    sendCount: number;

}

export const SenderSchema = SchemaFactory.createForClass(Sender);

SenderSchema.index({ pair: 1 }, { unique: true });
