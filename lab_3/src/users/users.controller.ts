import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserId } from './user-id.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiSecurity } from '@nestjs/swagger';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch()
  @ApiSecurity('AccessCookie')
  selfUpdate(@UserId() userId: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(userId, updateUserDto);
  }

  @Delete()
  @ApiSecurity('AccessCookie')
  selfRemove(@UserId() userId: string) {
    return this.usersService.remove(userId);
  }
}
