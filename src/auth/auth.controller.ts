import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage } from 'src/customDecorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto, RegisterUserDto } from 'src/users/dto/create-user.dto';
import { Request, Response } from 'express';

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ResponseMessage("User login")
  async handleLogin(@Req() req: any, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response);
  }

  @Public()
  @ResponseMessage("Resgister a new user")
  @Post('/register')
  async register(@Body() registerUserDto: RegisterUserDto){
    return this.authService.register(registerUserDto);    
  }
}
