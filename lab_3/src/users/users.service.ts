import { Repository } from 'typeorm';

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user);
  }

  findAll() {
    return this.usersRepository.find();
  }

  async findOneById(id: string) {
    const user = await this.usersRepository.findOneBy({ id });

    if(!user) throw new BadRequestException(`User with id=${id} not found`);
    
    return new UserResponseDto(user);
  }

  findOne(params: FindUserDto) {
    return this.usersRepository.findOneBy(params);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.usersRepository.update(id, updateUserDto);
    return await this.usersRepository.findOneBy({ id });
  }

  remove(id: string) {
    return;
  }
}
