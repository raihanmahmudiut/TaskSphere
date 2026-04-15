import {
  Controller,
  Get,
  Patch,
  Delete,
  Req,
  UseGuards,
  Body,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';

type AuthUser = {
  uuid: string;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
};

@ApiTags('users')
@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Search for a user by email' })
  @ApiQuery({ name: 'email', required: true })
  @ApiResponse({ status: 200, description: 'User found.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @UseGuards(JwtAuthGuard)
  @Get('search')
  async searchByEmail(@Query('email') email: string) {
    if (!email) throw new NotFoundException('Email query param required');
    const user = await this.usersService.findByEmailSafe(email);
    if (!user) throw new NotFoundException('No user found with that email');
    return user;
  }

  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Return user profile.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req: Request) {
    const user = req.user as AuthUser;
    return this.usersService.findById(user.uuid);
  }

  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'User profile updated.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateProfile(
    @Req() req: Request,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = req.user as AuthUser;
    return this.usersService.update(user.uuid, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete user account' })
  @ApiResponse({ status: 200, description: 'User account deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async deleteProfile(@Req() req: Request) {
    const user = req.user as AuthUser;
    return this.usersService.delete(user.uuid);
  }
}
