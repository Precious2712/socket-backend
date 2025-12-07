
import { IsIn, IsMongoId, IsNotEmpty } from 'class-validator';

export class UpdateSenderDto {
    @IsIn(['accepted', 'rejected', 'pending'])
    @IsNotEmpty()
    status: 'accepted' | 'rejected' | 'pending';

    @IsMongoId()
    @IsNotEmpty()
    currentUserId: string;
}
