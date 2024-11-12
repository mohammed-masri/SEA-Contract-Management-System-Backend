import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  ContractShortArrayDataResponse,
  CreateContractDto,
} from './contract.dto';
import { ContractService } from 'src/models/contract/contract.service';
import { JWTAuthGuard } from 'src/guards/jwt-auth.guard';
import { AuthorizedRequest, FindAllDto } from 'src/common/global.dto';
import { UserService } from 'src/models/user/user.service';
import { ContractFullResponse } from 'src/models/contract/contract.dto';

@Controller('contracts')
@ApiTags('My Contracts')
@UseGuards(JWTAuthGuard)
export class ContractController {
  constructor(
    private readonly contractService: ContractService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'fetch my contracts' })
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
    type: ContractShortArrayDataResponse,
  })
  async findAll(@Request() req: AuthorizedRequest, @Query() query: FindAllDto) {
    const userId = req.context.id;
    await this.userService.checkIsFound({ where: { id: userId } });

    return await this.contractService.makeContractShortArrayDataResponseForUser(
      userId,
      query.page,
      query.limit,
    );
  }

  @Get('/:id')
  @ApiOperation({ summary: 'get contract details' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID',
  })
  @ApiOkResponse({
    description: 'Contract fetched successfully',
    type: ContractFullResponse,
  })
  @ApiNotFoundResponse({ description: 'Contract not found' })
  async fetchContractDetails(@Param('id') id: string) {
    const contract = await this.contractService.checkIsFound({ where: { id } });
    const contractResponse =
      await this.contractService.makeContractFullResponse(contract);
    return contractResponse;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new contract' })
  @ApiCreatedResponse({
    description: 'The contract has been created successfully.',
    type: Boolean,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async create(
    @Body() body: CreateContractDto,
    @Request() req: AuthorizedRequest,
  ) {
    const userId = req.context.id;
    await this.userService.checkIsFound({ where: { id: userId } });

    await this.contractService.create(body, userId);
    return true;
  }
}
