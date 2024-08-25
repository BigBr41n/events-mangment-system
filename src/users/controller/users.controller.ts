import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from '../service/users.service';
import { UpdateUserDto } from '../dtos/UpdateUser.dto';
import { FastifyRequest } from 'fastify';
import { JwtAuthGuard } from '../../auth/guards/JwtAuthGuard.guard';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('users')
@Controller('api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'get user by id of current logged in' })
  @ApiOkResponse({ description: 'return the User data' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  getUser(@Request() req: FastifyRequest) {
    //only the user can access his account info
    return this.userService.getUserById(req.user.sub);
  }

  @Put()
  @ApiOperation({ summary: 'update the user data' })
  @ApiOkResponse({ description: 'return the new user data' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  updateUser(
    @Request() req: FastifyRequest,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(req.user.sub, updateUserDto);
  }

  @Delete()
  @ApiOperation({ summary: 'delete the user account' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'User not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  deleteUser(@Request() req: FastifyRequest) {
    return this.userService.deleteUser(req.user.sub);
  }
}
