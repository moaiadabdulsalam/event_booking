import { IsString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  eventId!: string;

  @IsString()
  seatId!: string;
}
