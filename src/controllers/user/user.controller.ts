import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { UserService } from 'src/models/user/user.service';
import {
  ChangePasswordDto,
  CreateUserDto,
  FindAllDto,
  UpdateUserDto,
  UserArrayDataResponse,
} from './user.dto';
import { UserResponse } from 'src/models/user/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
    type: UserResponse,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async create(@Body() data: CreateUserDto) {
    const user = await this.userService.create(data);
    const userResponse = await this.userService.makeUserResponse(user);
    return userResponse;
  }

  @Get()
  @ApiOperation({ summary: 'fetch users' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @ApiResponse({
    status: 200,
    description: 'Retrieve a paginated list of users',
    type: UserArrayDataResponse,
  })
  async findAll(@Query() query: FindAllDto) {
    const { totalCount, users } = await this.userService.findAll(
      {},
      query.page,
      query.limit,
    );

    return new UserArrayDataResponse(
      totalCount,
      users,
      query.page,
      query.limit,
    );
  }

  @Get('/:id')
  @ApiOperation({ summary: 'get user details' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID',
  })
  @ApiOkResponse({
    description: 'User fetched successfully',
    type: UserResponse,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  async fetchUserDetails(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.checkIsFound({ where: { id } });
    const userResponse = await this.userService.makeUserResponse(user);
    return userResponse;
  }

  @Put('/:id')
  @ApiOperation({ summary: 'update user details' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID',
  })
  @ApiOkResponse({
    description: 'User updated successfully',
    type: UserResponse,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  async updateUserDetails(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ) {
    let user = await this.userService.checkIsFound({ where: { id } });
    user = await this.userService.update(user, body);
    const userResponse = await this.userService.makeUserResponse(user);
    return userResponse;
  }

  @Put('/:id/change-password')
  @ApiOperation({ summary: 'change user password' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID',
  })
  @ApiOkResponse({
    description: 'User password has been changed successfully',
    type: Boolean,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  async changeUserPassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ChangePasswordDto,
  ) {
    const user = await this.userService.checkIsFound({ where: { id } });
    return await this.userService.changePassword(user, body.newPassword);
  }

  @Put('/:id/toggle-lock')
  @ApiOperation({ summary: 'toggle lock user account' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID',
  })
  @ApiOkResponse({
    description: 'the lock status has been changed successfully',
    type: UserResponse,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  async toggleLock(@Param('id', ParseIntPipe) id: number) {
    let user = await this.userService.checkIsFound({ where: { id } });
    user = await this.userService.toggleLockStatus(user);
    return await this.userService.makeUserResponse(user);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'delete user (soft delete)' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the user to delete',
  })
  @ApiNoContentResponse({
    description: 'User successfully soft deleted',
    type: UserResponse,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.checkIsFound({ where: { id } });
    await this.userService.delete(user);
    const userResponse = await this.userService.makeUserResponse(user);
    return userResponse;
  }
}
