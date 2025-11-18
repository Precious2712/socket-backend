import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId, Types } from 'mongoose';
import { CreateRequestDto } from './dto/create-request-dto';
import { Request } from './schema/request-schema';
import { Singnup } from 'src/auth/schema/auth-schema';

@Injectable()
export class RequestService {
    constructor(
        @InjectModel(Request.name) private requestModel: Model<Request>,
        @InjectModel(Singnup.name) private signupModel: Model<Singnup>,
    ) { }

    async createFriendRequestList(dto: CreateRequestDto) {
        const {
            logInUserId,
            logInFirstName,
            loginLastName,
            loginGender,
            reciever,
            recieverFirstName,
            recieverLastName,
        } = dto;

        const requiredFields = {
            logInUserId,
            logInFirstName,
            loginLastName,
            loginGender,
            reciever,
            recieverFirstName,
            recieverLastName,
        };

        for (const [key, value] of Object.entries(requiredFields)) {
            if (!value) {
                throw new BadRequestException(`${key} is required`);
            }
        }

        if (logInUserId === reciever) {
            throw new BadRequestException('You cannot send a friend request to yourself');
        }

        const duplicate = await this.requestModel
            .findOne({
                $or: [
                    {
                        logInUserId: new Types.ObjectId(logInUserId),
                        reciever: new Types.ObjectId(reciever),
                    },
                    {
                        logInUserId: new Types.ObjectId(reciever),
                        reciever: new Types.ObjectId(logInUserId),
                    },
                ],
            })
            .lean();

        if (duplicate) {
            throw new BadRequestException('A friend request already exists between these users');
        }

        const onlineUser = await this.signupModel.findById(logInUserId).lean();
        if (!onlineUser) throw new NotFoundException('Sender user not found');

        const receivingUser = await this.signupModel.findById(reciever).lean();
        if (!receivingUser) throw new NotFoundException('Receiver user not found');

        const data = {
            ...dto,
            logInUserId: new Types.ObjectId(onlineUser._id),
            reciever: new Types.ObjectId(receivingUser._id),
            loginStatus: !!onlineUser.login,
            recieverStatus: !!receivingUser.login,
        };

        const created = await this.requestModel.create(data);

        return { message: 'Created successfully', success: true, data: created };
    }

    async searchField(query: { loginUserId?: string; response?: string; reciever?: string }) {
        const filter: Record<string, any> = {};

        if (query.loginUserId) {
            if (!isValidObjectId(query.loginUserId)) {
                throw new BadRequestException('Invalid loginUserId format');
            }
            filter.logInUserId = new Types.ObjectId(query.loginUserId);
        }

        if (query.response !== undefined) {
            filter.response = query.response === 'true';
        }

        if (query.reciever !== undefined) {
            if (!isValidObjectId(query.reciever)) {
                throw new BadRequestException('Invalid reciever format');
            }
            filter.reciever = new Types.ObjectId(query.reciever);
        }

        const result = await this.requestModel
            .find(filter)
            .populate('logInUserId reciever')
            .lean();

        return { message: 'Filter field return', success: true, result };
    }

    async responseRequest(requestId: string, response: boolean) {
        if (!isValidObjectId(requestId)) throw new BadRequestException('Invalid request id');

        const user = await this.requestModel
            .findByIdAndUpdate(requestId, { response }, { new: true })
            .lean();

        if (!user) throw new NotFoundException('Request not found');

        return { message: 'Response status updated successfully', user };
    }

    async removeDocument(id: string) {
        if (!isValidObjectId(id)) throw new BadRequestException('Invalid id');

        const findId = await this.requestModel.findByIdAndDelete(id).lean();

        if (!findId) throw new NotFoundException('Document not found');

        return { message: 'Document deleted', success: true, findId };
    }

    async setUserLoginStatus(userId: string, loginStatus: boolean, mirrorToRequests = true) {
        if (!isValidObjectId(userId)) throw new BadRequestException('Invalid user id');

        const user = await this.signupModel
            .findByIdAndUpdate(userId, { login: loginStatus }, { new: true })
            .lean();

        if (!user) throw new NotFoundException('User not found');

        if (mirrorToRequests) {
            await this.requestModel.updateMany(
                { logInUserId: new Types.ObjectId(userId) },
                { $set: { loginStatus } },
            );

            await this.requestModel.updateMany(
                { reciever: new Types.ObjectId(userId) },
                { $set: { recieverStatus: loginStatus } },
            );
        }

        return { message: 'User login status updated', user };
    }
}
