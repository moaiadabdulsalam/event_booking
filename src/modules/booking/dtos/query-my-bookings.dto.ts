import { IsEnum, IsOptional } from 'class-validator';
import { BookingStatus } from '@prisma/client';

export class QueryMyBookingsDto {
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;
}