import {
    Schema,
    Prop,
    SchemaFactory
} from "@nestjs/mongoose";

import {
    Types
} from "mongoose";

@Schema({ timestamps: true })
export class Singnup {
    @Prop({
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    })
    email: string;

    @Prop({
        required: true,
        minlength: 7,
    })
    password: string;

    @Prop({
        required: true,
        enum: ['Male', 'Female']
    })
    gender: string;

    @Prop({
        default: false
    })
    login: boolean;

    @Prop({
        required: true
    })
    firstName: string;
    
    @Prop({
        required: true
    })
    lastName: string;
}

export const authSchema = SchemaFactory.createForClass(Singnup);