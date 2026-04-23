import {
  Controller,
  Post,
  Req,
  Body,
  Get,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { BookingService } from '../services/booking.service';
import { CreateBookingDto } from '../dtos/create-booking.dto';
import { QueryMyBookingsDto } from '../dtos/query-my-bookings.dto';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingsService: BookingService) {}

  @Post()
  createBooking(@Req() req: any, @Body() dto: CreateBookingDto) {
    return this.bookingsService.createBooking(req.user.sub, dto);
  }

  @Get('me')
  getMyBookings(@Req() req: any, @Query() query: QueryMyBookingsDto) {
    return this.bookingsService.getMyBookings(req.user.sub, query);
  }

  @Get(':id')
  getBookingById(@Param('id') id: string) {
    return this.bookingsService.getBookingById(id);
  }

  @Patch(':id/cancel')
  cancelBooking(@Param('id') id: string) {
    return this.bookingsService.cancelBooking(id);
  }
}
