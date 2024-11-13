import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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
  ApiTags,
} from '@nestjs/swagger';

import {
  ContractShortArrayDataResponse,
  CreateContractDto,
  CreateContractSectionDto,
  UpdateContractSectionDto,
} from './contract.dto';
import { ContractService } from 'src/models/contract/contract.service';
import { JWTAuthGuard } from 'src/guards/jwt-auth.guard';
import { AuthorizedRequest, FindAllDto } from 'src/common/global.dto';
import { UserService } from 'src/models/user/user.service';
import { ContractFullResponseForUser } from 'src/models/contract/contract.dto';
import { ContractSectionService } from 'src/models/contract-section/contract-section.service';

@Controller('contracts')
@ApiTags('My Contracts')
@UseGuards(JWTAuthGuard)
export class ContractController {
  constructor(
    private readonly contractService: ContractService,
    private readonly userService: UserService,
    private readonly contractSectionService: ContractSectionService,
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
  @ApiOkResponse({
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
    type: String,
    description: 'ID',
  })
  @ApiOkResponse({
    description: 'Contract fetched successfully',
    type: ContractFullResponseForUser,
  })
  @ApiNotFoundResponse({ description: 'Contract not found' })
  async fetchContractDetails(
    @Param('id') id: string,
    @Request() req: AuthorizedRequest,
  ) {
    const userId = req.context.id;
    await this.userService.checkIsFound({ where: { id: userId } });

    const contract = await this.contractService.checkIsFound({ where: { id } });
    const contractResponse =
      await this.contractService.makeContractFullResponseForUser(
        contract,
        userId,
      );
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

  @Delete('/:id')
  @ApiOperation({ summary: 'delete a contract' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID',
  })
  @ApiOkResponse({
    description: 'Contract deleted successfully',
    type: Boolean,
  })
  @ApiNotFoundResponse({ description: 'Contract not found' })
  async deleteContract(@Param('id') id: string) {
    const contract = await this.contractService.checkIsFound({ where: { id } });
    await this.contractService.delete(contract);
    return true;
  }

  @Post('/:contractId/sections')
  @ApiOperation({ summary: 'Create a new contract section' })
  @ApiParam({
    name: 'contractId',
    type: String,
    description: 'Contract Id',
  })
  @ApiCreatedResponse({
    description: 'The contract section has been created successfully.',
    type: Boolean,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async createContractSection(
    @Param('contractId') contractId: string,
    @Body() body: CreateContractSectionDto,
    @Request() req: AuthorizedRequest,
  ) {
    const userId = req.context.id;
    await this.userService.checkIsFound({ where: { id: userId } });

    const contract = await this.contractService.checkIsFound({
      where: { id: contractId },
    });

    const contractSection = await this.contractSectionService.create(
      contract,
      body.title,
      body.content,
      body.order,
      body.parentId,
    );

    await this.contractService.calculateStatus(contract, 'create-section');

    return contractSection;
  }

  @Put('/:contractId/sections/:sectionId')
  @ApiOperation({ summary: 'update a contract section' })
  @ApiParam({
    name: 'contractId',
    type: String,
    description: 'Contract Id',
  })
  @ApiParam({
    name: 'sectionId',
    type: String,
    description: 'Section Id',
  })
  @ApiOkResponse({
    description: 'The contract section has been updated successfully.',
    type: Boolean,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async updateContractSection(
    @Param('contractId') contractId: string,
    @Param('sectionId') sectionId: string,
    @Body() body: UpdateContractSectionDto,
    @Request() req: AuthorizedRequest,
  ) {
    const userId = req.context.id;
    await this.userService.checkIsFound({ where: { id: userId } });

    const contract = await this.contractService.checkIsFound({
      where: { id: contractId },
    });

    const contractSection = await this.contractSectionService.checkIsFound({
      where: { id: sectionId },
    });

    await this.contractSectionService.update(
      contract,
      contractSection,
      body.title,
      body.content,
      body.order,
      body.parentId,
    );

    await this.contractService.calculateStatus(contract, 'update-section');

    return contractSection;
  }

  @Delete('/:contractId/sections/:sectionId')
  @ApiOperation({ summary: 'Delete a contract section' })
  @ApiParam({
    name: 'contractId',
    type: String,
    description: 'Contract Id',
  })
  @ApiParam({
    name: 'sectionId',
    type: String,
    description: 'Section Id',
  })
  @ApiOkResponse({
    description: 'The contract section has been deleted successfully.',
    type: Boolean,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async deleteContractSection(
    @Param('contractId') contractId: string,
    @Param('sectionId') sectionId: string,
    @Request() req: AuthorizedRequest,
  ) {
    const userId = req.context.id;
    await this.userService.checkIsFound({ where: { id: userId } });

    const contract = await this.contractService.checkIsFound({
      where: { id: contractId },
    });

    const contractSection = await this.contractSectionService.checkIsFound({
      where: { id: sectionId },
    });

    await this.contractSectionService.delete(contractSection);

    await this.contractService.calculateStatus(contract, 'delete-section');

    return contractSection;
  }
}
