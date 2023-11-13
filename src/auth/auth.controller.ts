import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage } from 'src/customDecorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto, RegisterUserDto } from 'src/users/dto/create-user.dto';

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async handleLogin(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @Public()
  @ResponseMessage("Resgister a new user")
  @Post('/register')
  async register(@Body() registerUserDto: RegisterUserDto){
    return this.authService.register(registerUserDto);    
  }
}
