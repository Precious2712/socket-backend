import {
    Prop,
    Schema,
    SchemaFactory
} from "@nestjs/mongoose";

import { Types } from "mongoose";
import { Singnup } from "src/auth/schema/auth-schema";

@Schema({ timestamps: true })
export class Request {
    @Prop({ type: Types.ObjectId, ref: Singnup.name, required: true })
    logInUserId: string;

    @Prop({ required: true })
    logInFirstName: string;

    @Prop({ required: true })
    loginLastName: string;

    @Prop({ required: true })
    recieverLastName: string;

    @Prop({ default: false })
    response: boolean;

    @Prop({ type: Types.ObjectId, ref: Singnup.name, required: true })
    reciever: string;

    @Prop({ required: true })
    recieverStatus: boolean;

    @Prop({ required: true })
    recieverFirstName: string;

    @Prop({
        required: true,
        enum: ['Male', 'Female']
    })
    loginGender: string;

    @Prop({ required: true })
    loginStatus: boolean;
}

export const request = SchemaFactory.createForClass(Request);

request.index(
    { logInUserId: 1, reciever: 1 },
    { unique: true }
);