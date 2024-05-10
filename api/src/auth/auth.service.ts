import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './login-dto/login.dto';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './signup-dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async validateUser(LoginDto: LoginDto): Promise<any> {
    try {
      const { email, password } = LoginDto;
      console.log(email, password);

      if (!email) {
        throw new BadRequestException('Email is not found');
      }

      const user = await this.prisma.user.findUnique({ where: { email } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new BadRequestException('Credentials not correct');
      }

      const token = this.jwt.sign(
        { user: user.id, email: user.email },
        { secret: process.env.JWT_SECRET },
      );

      return { user, token };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async createUser(signupDto: SignupDto): Promise<any> {
    try {
      const { name, email, password } = signupDto;

      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      return { user };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getAllUsers() {
    try {
      const allUsers = await this.prisma.user.findMany({
        include: {
          post: true,
        },
      });
      return { allUsers };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getSingleUser(id: string) {
    try {
      const singleUser = await this.prisma.user.findUnique({
        where: { id },
        include: { post: true },
      });
      return { singleUser };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
