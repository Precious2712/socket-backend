import { IsEmail, IsMongoId, IsNotEmpty, IsString, IsIn } from 'class-validator';
import { Types } from 'mongoose';

export class CreateRequestDto {
    @IsMongoId()
    @IsNotEmpty()
    logInUserId: Types.ObjectId;

    @IsString()
    @IsNotEmpty()
    logInFirstName: string;

    @IsString()
    @IsNotEmpty()
    loginLastName: string;

    @IsString()
    @IsIn(['Male', 'Female'], { message: 'Gender must be Male or Female' })
    @IsNotEmpty()
    loginGender: string;

    @IsMongoId()
    @IsNotEmpty()
    reciever: Types.ObjectId;

    @IsString()
    @IsNotEmpty()
    recieverFirstName: string;

    @IsString()
    @IsNotEmpty()
    recieverLastName: string;

    // @IsNotEmpty()
    // loginStatus: boolean;

    // @IsNotEmpty()
    // recieverStatus: boolean;
}