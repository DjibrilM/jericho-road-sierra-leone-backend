import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class verifyTokenDto  {

  @IsNotEmpty()
  token:string
}



export class deleteFileFromCloudinary {
@IsNotEmpty()
filepublicUrl:string
}