import { ApiProperty } from '@nestjs/swagger';
import { Request } from 'express';

export class ArrayDataResponse<T> {
  @ApiProperty({ type: Number })
  totalCount: number;
  @ApiProperty({ type: Number })
  page: number;
  @ApiProperty({ type: Number })
  limit: number;
  @ApiProperty({ isArray: true })
  data: Array<T>;
  @ApiProperty({ type: Number })
  totalPages: number;

  constructor(totalCount: number, data: Array<T>, page: number, limit: number) {
    this.data = data;
    this.totalCount = totalCount;
    this.page = page;
    this.limit = limit;
    this.totalPages = 0;
    if (limit !== 0) this.totalPages = Math.ceil(totalCount / limit);
  }
}

export class AuthorizedRequest extends Request {
  context: {
    id: number;
  };
}
