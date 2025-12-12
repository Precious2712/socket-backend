import {
    Injectable,
    BadRequestException,
    NotFoundException,
    ForbiddenException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Sender } from './schema/sender-schema';
import { Singnup } from 'src/auth/schema/auth-schema';
import { CreateSenderDto } from './dto/create-sender-dto';
import { UpdateSenderDto } from './dto/update-sender-dto';

@Injectable()
@Injectable()
export class SenderService {
    constructor(
        @InjectModel(Sender.name) private senderModel: Model<Sender>,
        @InjectModel(Singnup.name) private userModel: Model<Singnup>,
    ) {}

    private normalizePair(a: string, b: string): string {
        return a < b ? `${a}_${b}` : `${b}_${a}`;
    }

    async sendRequest(dto: CreateSenderDto) {
        const { senderId, receiverId } = dto;

        if (senderId === receiverId) {
            throw new BadRequestException('You cannot send a friend request to yourself.');
        }

        const sender = await this.userModel.findById(senderId).lean();
        const receiver = await this.userModel.findById(receiverId).lean();

        if (!sender || !receiver) {
            throw new NotFoundException('Sender or receiver not found.');
        }

        const pair = this.normalizePair(senderId, receiverId);
        const existing = await this.senderModel.findOne({ pair });

        if (existing) {
            if (existing.sendCount >= 1) {
                throw new BadRequestException('A request is already established between these two users.');
            }

            existing.senderId = new Types.ObjectId(senderId);
            existing.receiverId = new Types.ObjectId(receiverId);
            existing.status = 'pending';

            existing.senderFirstName = sender.firstName;
            existing.senderLastName = sender.lastName;
            existing.senderGender = sender.gender;

            existing.sendCount += 1;

            return existing.save();
        }

        return this.senderModel.create({
            senderId: new Types.ObjectId(senderId),
            receiverId: new Types.ObjectId(receiverId),
            pair,

            senderFirstName: sender.firstName,
            senderLastName: sender.lastName,
            senderGender: sender.gender,

            status: 'pending',
            sendCount: 1
        });
    }

    async updateRequest(requestId: string, dto: UpdateSenderDto) {
        const { status, currentUserId } = dto;

        const request = await this.senderModel.findById(requestId);
        if (!request) throw new NotFoundException('Friend request not found.');

        if (request.receiverId.toString() !== currentUserId) {
            throw new ForbiddenException('Only the receiver can accept or reject this request.');
        }

        request.status = status;

        return request.save();
    }

    async deleteRequest(requestId: string, currentUserId: string) {
        const request = await this.senderModel.findById(requestId);
        if (!request) throw new NotFoundException('Request not found.');

        const isParticipant =
            request.senderId.toString() === currentUserId ||
            request.receiverId.toString() === currentUserId;

        if (!isParticipant) {
            throw new ForbiddenException('You are not allowed to delete this request.');
        }

        await this.senderModel.deleteOne({ _id: requestId });
        return { deleted: true };
    }

    async getPendingRequestsForUser(userId: string) {
        return this.senderModel
            .find({
                receiverId: new Types.ObjectId(userId),
                status: 'pending'
            })
            .populate('senderId', 'firstName lastName gender login');
    }

    async getSentRequestsForUser(userId: string) {
        return this.senderModel
            .find({ senderId: userId })
            .populate('receiverId', 'firstName lastName gender login');
    }

    async getFriendsForUser(userId: string) {
        const userObjectId = new Types.ObjectId(userId);

        const friends = await this.senderModel
            .find({
                status: 'accepted',
                $or: [
                    { senderId: userObjectId },
                    { receiverId: userObjectId }
                ]
            })
            .populate('senderId', 'firstName lastName gender login')
            .populate('receiverId', 'firstName lastName gender login');

        return {
            totalFriends: friends.length,
            friends,
        };
    }

    async getAcceptedCountForUser(userId: string) {
        const userObjectId = new Types.ObjectId(userId);

        const count = await this.senderModel.countDocuments({
            status: 'accepted',
            $or: [
                { senderId: userObjectId },
                { receiverId: userObjectId }
            ]
        });

        return { acceptedCount: count };
    }
}
