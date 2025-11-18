import { IsString } from "class-validator";

export class CreateChatDto {
    @IsString()
    senderId: string;

    @IsString()
    senderName: string;

    @IsString()
    receiverId: string;

    @IsString()
    receiverName: string;

    @IsString()
    message: string;
}