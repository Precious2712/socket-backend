import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAuthDto } from './dto/create-auth-dto';
import { Singnup } from './schema/auth-schema';
import { SearchUserDto } from './dto/search-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(Singnup.name) private signupModel: Model<Singnup>
    ) {}

    async SignupUsers(createAuthDto: CreateAuthDto) {
        const { email, gender, password, firstName, lastName } = createAuthDto;

        if (!email || !password || !firstName || !lastName) {
            throw new BadRequestException('Email and password are required');
        }

        if (gender !== 'Male' && gender !== 'Female') {
            throw new NotFoundException('Gender must be Male or Female');
        }

        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,12}$/;
        if (!passwordRegex.test(password)) {
            throw new BadRequestException(
                'Password must be 7 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
            );
        }

        const existingUser = await this.signupModel.findOne({ email });
        if (existingUser) {
            throw new BadRequestException('Email already in use');
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = {
            ...createAuthDto,
            password: hashedPassword,
        };

        const createUser = await this.signupModel.create(user);

        return {
            message: 'User created successfully',
            user: createUser,
        };
    }

    async LoginUser(email: string, password: string) {
        if (!email || !password) {
            throw new BadRequestException('Email and password needed');
        }

        const registeredUser = await this.signupModel.findOne({ email })
        if (!registeredUser) {
            throw new BadRequestException('Invalid crendentials');
        }

        const checkPassword = await bcrypt.compare(password, registeredUser.password);
        if (!checkPassword) {
            throw new BadRequestException('Invalid crendentials');
        }

        console.log('check-password', checkPassword);

        return {
            message: 'Log in success',
            success: true,
            registeredUser
        }
    }

    async Response() {
        const obj = [{ name: 'Odumirin Precious', gender: 'Male', status: 'Single' }]

        return {
            message: 'Success',
            obj
        }
    }

    async turnUserLoginToTrue(id: string, login: boolean) {
        const user = await this.signupModel.findByIdAndUpdate(
            id,
            { login: login },
            { new: true }
        );

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return {
            message: 'Login status updated successfully',
            user,
        };
    }

    async searchParameter(query: SearchUserDto) {
        const { firstName, lastName } = query;

        const filter: Record<string, any> = {};

        if (firstName) {
            filter.firstName = { $regex: firstName, $options: 'i' };
        }

        if (lastName) {
            filter.lastName = { $regex: lastName, $options: 'i' };
        }

        const data = await this.signupModel.find(filter);

        if (!data) {
            throw new BadRequestException('Invalid search result');
        }

        return {
            message: 'Search result found',
            success: true,
            data
        }
    }

    async userStatus(login: boolean) {
        const filter: Record<string, any> = {}

        if (login) {
            filter.login = login;
        }

        const offlineOrOnline = await this.signupModel.find(filter);

        if (!offlineOrOnline) {
            throw new BadRequestException('Search result not found');
        }

        return {
            message: 'Document Found',
            success: true,
            offlineOrOnline
        }
    }

    async getAllUsers() {
        const users = await this.signupModel.find();

        if (!users) {
            throw new BadRequestException('No result found');
        }

        return {
            message: 'Users document found',
            users
        }
    }

}