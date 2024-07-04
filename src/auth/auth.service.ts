import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './auth.entity';
import { AuthRepository } from './auth.repository';
import { SignupDto } from 'src/dtos/auth/signup.dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { LoginDto } from 'src/dtos/auth/loginDto.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  getJJwt(id: string) {
    return jwt.sign({ id }, 'im in love', {
      expiresIn: '90d',
    });
  }

  async signup(signupDto: SignupDto) {
    try {
      const { email, password, username } = signupDto;
      if (!email || !password) {
        throw new BadRequestException('Email and Password is required');
      }

      // check if email exists
      const emailExists = await this.authRepository.findOneBy({ email });

      if (emailExists) {
        throw new BadRequestException('User with this email currently exists');
      }

      if (password.length < 7) {
        throw new BadRequestException(
          'Password cannot be less than 7 characters',
        );
      }

      // hashing password
      const salt = await bcrypt.genSalt(10);
      const hashedPasseord = await bcrypt.hash(password, salt);

      const user = new User();

      user.username = username || '';
      user.email = email;
      user.password = hashedPasseord;
      user.createdAt = new Date(Date.now());
      user.updatedAt = new Date(Date.now());
      await this.authRepository.save(user);

      const token = await this.jwtService.sign({ id: user.id });

      return {
        status: 'Success',
        message: 'Signup successful',
        statusCode: 201,
        token,
        data: user,
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Something went wrong');
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // check if there is email and password
    if (!email || !password) {
      throw new BadRequestException('Email and password is required');
    }
    try {
      const user = await this.authRepository.findOneBy({ email });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // verify password
      const isCorrect = await bcrypt.compare(password, user.password);
      if (!isCorrect) {
        throw new BadRequestException('Login details incorrect');
      }

      const token = await this.jwtService.sign({ id: user.id });

      return {
        status: 'Success',
        message: 'Login successful',
        token,
        data: user,
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Something went wrong');
    }
  }
}
