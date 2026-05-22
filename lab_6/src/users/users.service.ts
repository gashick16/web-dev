import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BadRequestException } from '@nestjs/common';
import { User } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = new this.userModel(createUserDto);
    return await user.save();
  }

  async findAll() {
    return await this.userModel.find().exec();
  }

  async findOneById(id: string) {
    const user = await this.userModel.findById(id).exec();

    if(!user) throw new BadRequestException(`User with id=${id} not found`);
    
    return new UserResponseDto(user);
  }

  async findOne(params: FindUserDto) {
    return await this.userModel.findOne(params).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.userModel.updateOne({ _id: id }, updateUserDto).exec();
    return await this.userModel.findById(id).exec();
  }

  async remove(id: string) {
    return;
  }
}