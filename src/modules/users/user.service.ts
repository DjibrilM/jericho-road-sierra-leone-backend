import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,

} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User as usermodel } from './user.model';
import mongoose, { Model } from 'mongoose';
import {
  CreateUserDto,
  UpdateUserDto,
  UploadUserFaceReferenceDto,
} from './user.dto';
import { Bcrypt } from 'src/util/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { deleteFile } from 'src/modules/service/cloudinary';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(usermodel.name) private userSchema: Model<usermodel>,
    private jwtService: JwtService,
  ) {}

  async createUser(data: CreateUserDto) {
    try {
      const findUser = await this.userSchema.findOne({ email: data.email });
      const checkNumber = await this.userSchema.findOne({
        phoneNumber: data.phoneNumber,
      });
      if (checkNumber) throw new Error('Phone number already picked.');

      if (findUser) throw new Error('user with this email already exist');

      const encrypPassword = Bcrypt.hash(data.password as string);
      const newUser = await this.userSchema.create({
        ...data,
        password: encrypPassword,
      });

      newUser.password = undefined;

      const paload = {
        id: newUser.id,
        name: newUser.firstName + ' ' + newUser.secondName,
        email: newUser.email,
        role: newUser.role,
      };

      return {
        user: newUser,
        access_token: await this.jwtService.signAsync(paload),
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'something went wrong please try again later',
      );
    }
  }

  async getUsers() {
    try {
      return await this.userSchema.find().select('-password');
    } catch (error) {
      throw new InternalServerErrorException('Failed to load users');
    }
  }

  async getUser(id: mongoose.Schema.Types.ObjectId) {
    try {
      const user = await this.userSchema
        .findById(id)
        .select('-password')
        .exec();

      if (!user) {
        throw new Error('user not fund.');
      }

      return { user };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async getDoctors() {
    try {
      const data = await this.userSchema.find({ role: 'doctor' });
      return data;
    } catch (error) {
      console.log();
      throw new NotFoundException('failed to get doctors');
    }
  }

  async updateUserProfile(
    newData: UpdateUserDto,
    userId: mongoose.Schema.Types.ObjectId,
  ): Promise<any> {
    const user = await this.userSchema.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      const user = await this.userSchema.findById(userId);
      user.phoneNumber = newData.phoneNumber;
      user.profileImageUrl = newData.profileImageUrl;
      user.firstName = newData.firstName;
      user.secondName = newData.secondName;
      user.salary = newData.salary;

      await user.save();
      if (user.profileImageUrl !== newData.profileImageUrl) {
        await deleteFile(user.profileImageUrl);
      }

      return 'updated';
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async uploadFaceReference(request: UploadUserFaceReferenceDto) {
    const user = await this.userSchema.findByIdAndUpdate(request.id, {
      faceReferenceImages: request.images,
      hasBiometrics: true,
    });
    return user;
  }
}
