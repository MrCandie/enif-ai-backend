import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-jwt';
import { AuthRepository } from './auth.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './auth.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectRepository(User) private usersRepository: AuthRepository) {
    console.log('validating');
    super({
      secretOrKey: 'loverboy',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: { id: string }): Promise<User> {
    const user: User = await this.usersRepository.findOneBy({ id: payload.id });

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
