
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateSenderDto {
    @IsMongoId()
    @IsNotEmpty()
    senderId: string;

    @IsMongoId()
    @IsNotEmpty()
    receiverId: string;
}
