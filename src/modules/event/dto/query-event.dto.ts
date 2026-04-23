import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { EventStatus } from '@prisma/client';

export class QueryEventsDto {
  @IsNumber()
  @IsOptional()
  page?: number = 1;
  @IsNumber()
  @IsOptional()
  limit?: number = 10;
  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;

  @IsOptional()
  @IsString()
  search?: string;
}
