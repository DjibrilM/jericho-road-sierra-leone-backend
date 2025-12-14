import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/modules/users/user.model';
import { Model } from 'mongoose';
import { Bcrypt } from 'src/util/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { v2 as cloudinary } from 'cloudinary';
import { Role } from 'src/util/types';
import { Request } from 'express';


@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userSchema: Model<User>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    let user: any;

    try {
      user = await this.userSchema
        .findOne({ email: loginDto.email })
        .select('-id')
        .exec();

      if (!user) {
        throw new Error('no user found plase check your email');
      }
    } catch (error) {
      throw new NotFoundException(error.message);
    }

    const comparePassword = await Bcrypt.compare(
      user.password,
      loginDto.password,
    );

    if (!comparePassword) {
      throw new UnauthorizedException('wrong password');
    }

    user.password = undefined;

    const payload = {
      id: user.id,
      name: user.firstName + ' ' + user.secondName,
      email: user.email,
      role: user.role,
    };

    return {
      user,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async securityGuardLogin(loginDto: LoginDto) {
    let user: any;

    try {
      user = await this.userSchema
        .findOne({ email: loginDto.email })
        .select('-id')
        .exec();

      if (!user) {
        throw new Error('no user found plase check your email');
      }
    } catch (error) {
      throw new NotFoundException(error.message);
    }

    if ((user.role as Role) !== 'entry-checker') {
      throw new UnauthorizedException('failed to authorize you');
    }

    const comparePassword = await Bcrypt.compare(
      user.password,
      loginDto.password,
    );

    if (!comparePassword) {
      throw new UnauthorizedException('wrong password');
    }

    user.password = undefined;

    const payload = {
      id: user.id,
      name: user.firstName + ' ' + user.secondName,
      email: user.email,
      role: user.role,
    };

    return {
      user,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async verifyToken(token: string) {
    try {
      const verify = await this.jwtService.verify(token);

      const findUser = await this.userSchema
        .findById(verify.id)
        .select('-password');
      return { approved: true, user: findUser };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async deleteFile(filePublicId: string) {
    try {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET,
      });

      const match = filePublicId.match(/\/([^/]+)\.[a-z0-9]+$/i);
      const destroy = await cloudinary.uploader.destroy(match[1]);
      return 'Image deleted';
    } catch (error) {
      console.log(error);
    }
  }
}
