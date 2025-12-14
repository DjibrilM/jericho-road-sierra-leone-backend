import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  isNotEmpty,
} from 'class-validator';
import { Role } from 'src/util/types';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  salary: number;

  @IsString()
  @IsNotEmpty()
  secondName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  profileImageUrl: string;

  @IsNotEmpty()
  role: Role;
}

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  salary: number;

  @IsString()
  @IsNotEmpty()
  secondName: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  profileImageUrl: string;

  @IsNotEmpty()
  role: Role;
}

export class GetUserDto {
  @IsNotEmpty()
  id: string;
}

export class UploadUserFaceReferenceDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  images: string[];
}
