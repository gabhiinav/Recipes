import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './signup-dto/signup.dto';
import { LoginDto } from './login-dto/login.dto';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private jwt: JwtService,
  ) {}

  @Post('login')
  async login(@Request() req, @Response() res, @Body() loginDto: LoginDto) {
    try {
      const { user, token } = await this.auth.validateUser(loginDto);
      res.cookie('token', token, { httpOnly: true });
      res.status(200).json({
        message: 'Login successful',
        id: user.id,
        email: user.email,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Get('logout')
  async logout(@Response() res) {
    try {
      res.clearCookie('token');
      console.log('Logout successful');
      res.status(200).json({
        message: 'Logout successful',
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Post('signup')
  async signUp(@Response() res, @Body() signupDto: SignupDto): Promise<any> {
    try {
      const { user } = await this.auth.createUser(signupDto);
      console.log(user);
      res.status(200).json({
        message: 'User created successfully',
        user,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('check')
  getProfile(@Request() req, @Response() res) {
    const decode = this.jwt.decode(req.cookies['token']);
    res.status(200).json({
      isAuthenticated: true,
      id: decode.user,
      email: decode.email,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('allusers')
  async getAll(@Response() res) {
    try {
      const { allUsers } = await this.auth.getAllUsers();
      res.status(200).json({ allUsers });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Get('singleuser/:id')
  async singleUser(@Response() res, @Param('id') id: string) {
    try {
      const { singleUser } = await this.auth.getSingleUser(id);
      res.status(200).json({
        singleUser,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
