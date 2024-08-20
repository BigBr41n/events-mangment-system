import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/typeorm/User.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Token } from 'src/auth/types/Token.type';
import { UserData } from 'src/auth/types/UserData.type';
import { Credentials } from 'src/auth/types/credentials.type';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
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
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }),
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
    return newUser;
  }
}
