import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { Post, Body } from '@nestjs/common';
import {
  CreateUserDto,
  UpdateUserDto,
  UploadUserFaceReferenceDto,
} from './user.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { AdminCheck } from 'src/middlewares/admin.guard';
import mongoose from 'mongoose';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto): Promise<any> {
    return this.userService.createUser(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('find/one/:id')
  async getUser(@Param('id') id: mongoose.Schema.Types.ObjectId): Promise<any> {
    return this.userService.getUser(id);
  }

  // @UseGuards(AuthGuard)
  // @UseGuards(AdminCheck)
  @Get('find/all')
  async findsuser() {
    return await this.userService.getUsers();
  }

  @UseGuards(AuthGuard)
  @Get('doctors')
  async getDoctors() {
    return this.userService.getDoctors();
  }

  @UseGuards(AuthGuard)
  @UseGuards(AdminCheck)
  async deleteUser() {}

  @UseGuards(AuthGuard)
  @UseGuards(AdminCheck)
  @Post('update/profile/:id')
  async updateUser(
    @Param('id') id: mongoose.Schema.Types.ObjectId,
    @Body()
    body: UpdateUserDto,
  ) {
    return await this.userService.updateUserProfile(body, id);
  }

  @Post('upload-face-reference')
  async uploadFaceReference(@Body() body: UploadUserFaceReferenceDto) {
    return await this.userService.uploadFaceReference(body);
  }
}
