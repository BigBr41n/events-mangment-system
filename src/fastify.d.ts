import 'fastify';
import { JwtPayload } from '../jwt-payload.type';
import { User } from './typeorm/User.entity';

declare module 'fastify' {
  interface FastifyRequest {
    user: JwtPayload | User;
  }
}
