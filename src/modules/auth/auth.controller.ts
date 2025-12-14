import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginDto,
  verifyTokenDto,
  deleteFileFromCloudinary,
} from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  create(@Body() loginDto: LoginDto) {
    console.log({loginDto});
    return this.authService.login(loginDto);
  }

  @Post('/security-guard-login')
  securityGuardLogin(@Body() loginDto: LoginDto) {
    return this.authService.securityGuardLogin(loginDto);
  }

  @Post('/verify-token')
  verifyToken(@Body() body: verifyTokenDto) {
    return this.authService.verifyToken(body.token);
  }

  @Post('file/delete')
  async deleteFileFomCloudinary(@Body() body: deleteFileFromCloudinary) {
    return await this.authService.deleteFile(body.filepublicUrl);
  }
}

