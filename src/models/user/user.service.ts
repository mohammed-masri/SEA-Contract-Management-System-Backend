import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './user.model';
import { Constants } from 'src/config';
import { Attributes, FindOptions } from 'sequelize';
import { UserResponse } from './user.dto';
import { Op } from 'sequelize';
import { BcryptUtils } from 'src/utils';

@Injectable()
export class UserService {
  constructor(
    @Inject(Constants.Database.DatabaseRepositories.UserRepository)
    private userRepository: typeof User,
  ) {}

  async findAll(
    options?: FindOptions<Attributes<User>>,
    page: number = 1,
    limit: number = 10,
  ) {
    if (page < 1) page = 1;
    const offset = (page - 1) * limit;
    const { count: totalCount, rows: users } =
      await this.userRepository.findAndCountAll({
        ...options,
        limit,
        offset,
      });
    return {
      totalCount,
      users,
    };
  }

  async findOne(options?: FindOptions<Attributes<User>>) {
    return await this.userRepository.findOne(options);
  }

  async checkIsFound(options?: FindOptions<Attributes<User>>) {
    const user = await this.findOne(options);
    if (!user) throw new NotFoundException(`User not found!`);

    return user;
  }

  async checkPhoneNumberRegistered(phoneNumber: string) {
    const existingUser = await this.userRepository.findOne({
      where: {
        phoneNumber: { [Op.eq]: phoneNumber },
      },
    });

    if (existingUser) {
      throw new BadRequestException('Phone Number already in use');
    }
  }

  async checkEmailRegistered(email: string) {
    const existingUser = await this.userRepository.findOne({
      where: {
        email: { [Op.eq]: email },
      },
    });

    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }
  }

  async create(data: Attributes<User>) {
    await this.checkPhoneNumberRegistered(data.phoneNumber);
    await this.checkEmailRegistered(data.email);

    const user = new User({ ...data });
    return user.save();
  }

  async update(user: User, data: Attributes<User>) {
    if (data.phoneNumber && data.phoneNumber !== user.phoneNumber)
      await this.checkPhoneNumberRegistered(data.phoneNumber);
    if (data.email && data.email !== user.email)
      await this.checkEmailRegistered(data.email);

    return await user.update({ ...data });
  }

  async toggleLockStatus(user: User) {
    user.isLocked = !user.isLocked;
    return await user.save();
  }

  async delete(user: User) {
    await user.destroy();
  }

  async changePassword(
    user: User,
    newPassword: string,
    compareTheOldPassword: boolean = false,
    oldPassword: string = null,
  ) {
    if (compareTheOldPassword) {
      const isCorrect = await BcryptUtils.comparePassword(
        oldPassword,
        user?.password,
      );

      if (!isCorrect)
        throw new UnauthorizedException('Old password is incorrect.');
    }

    user.password = newPassword;
    await user.save();
    return true;
  }

  makeUserResponse(user: User) {
    return new UserResponse(user);
  }
}
