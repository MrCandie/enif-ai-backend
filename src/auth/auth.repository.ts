import { Repository } from 'typeorm';
import { User } from './auth.entity';

export class AuthRepository extends Repository<User> {}
