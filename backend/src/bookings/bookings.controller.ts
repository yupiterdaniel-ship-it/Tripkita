import {
  Controller, Get, Post, Put, Patch, Delete,
  Param, Body, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingDto } from './bookings.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  /** GET /bookings?status=confirmed&paymentStatus=paid */
  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('paymentStatus') paymentStatus?: string,
  ) {
    return this.bookingsService.findAll(status, paymentStatus);
  }

  /** GET /bookings/stats – dashboard summary */
  @Get('stats')
  getStats() {
    return this.bookingsService.getDashboardStats();
  }

  /** GET /bookings/:id */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  /** POST /bookings */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateBookingDto) {
    return this.bookingsService.create(dto);
  }

  /** PUT /bookings/:id */
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBookingDto) {
    return this.bookingsService.update(id, dto);
  }

  /** PATCH /bookings/:id */
  @Patch(':id')
  patch(@Param('id') id: string, @Body() dto: UpdateBookingDto) {
    return this.bookingsService.update(id, dto);
  }

  /** PATCH /bookings/:id/cancel */
  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.bookingsService.cancel(id);
  }

  /** DELETE /bookings/:id */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingsService.cancel(id); // soft cancel
  }
}
