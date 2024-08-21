import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../../../typeorm/User.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Token } from '../../types/Token.type';
import { UserData } from '../../types/UserData.type';
import { Credentials } from '../../types/credentials.type';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from '../../types/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(credentials: Credentials): Promise<User> {
    // Validate user credentials against database or any external service
    // Return the user back

    //retrieve the user
    const user = await this.userRepository.findOne({
      where: { email: credentials.email },
    });

    //if no user found:
    if (!user) {
      throw new NotFoundException('User not found');
    }

    //if user found but password does not match:
    const isMatch = await bcrypt.compare(
      credentials.password,
      user.passwordHash,
    );
    if (!isMatch) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    //if everything is fine:
    return user;
  }

  async login(user: User): Promise<Token> {
    //the payload to sign:
    const payload = { username: user.username, sub: user.id };
    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    //save refresh token to the db
    user.refreshToken = refresh_token;
    this.userRepository.save(user);

    //creating access token
    const access_token = this.jwtService.sign(payload);

    //return the tokens
    return {
      access_token,
      refresh_token,
    };
  }

  async validateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user && user.refreshToken === refreshToken) {
      return true;
    }
    throw new UnauthorizedException(
      'Invalid refresh token, please login again',
    );
  }

  //creating a new user (registering a new user)
  async register(userData: UserData) {
    //hash the password
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    //remove password from userData object
    const { password, ...user } = userData;

    //create the user
    const newUser = this.userRepository.create({
      ...user,
      passwordHash: hashedPassword,
      role: 'Attendee',
    });
    await this.userRepository.save(newUser);
    const { passwordHash, ...restUserInfo } = newUser;
    return restUserInfo;
  }

  async refreshTOken(payload: JwtPayload): Promise<{ accessToken: string }> {
    const newAccessToken = await this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '5h',
    });
    return { accessToken: newAccessToken };
  }
}
