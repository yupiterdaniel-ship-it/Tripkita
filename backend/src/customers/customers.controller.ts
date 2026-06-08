import {
  Controller, Get, Post, Put, Delete, Patch,
  Param, Body, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto, UpdateCustomerDto } from './customers.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  /** GET /customers?search=budi */
  @Get()
  findAll(@Query('search') search?: string) {
    return this.customersService.findAll(search);
  }

  /** GET /customers/:id */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  /** GET /customers/:id/bookings */
  @Get(':id/bookings')
  getBookings(@Param('id') id: string) {
    return this.customersService.getBookingHistory(id);
  }

  /** POST /customers */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateCustomerDto) {
    return this.customersService.create(dto);
  }

  /** PUT /customers/:id */
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCustomerDto) {
    return this.customersService.update(id, dto);
  }

  /** PATCH /customers/:id */
  @Patch(':id')
  patch(@Param('id') id: string, @Body() dto: UpdateCustomerDto) {
    return this.customersService.update(id, dto);
  }

  /** DELETE /customers/:id */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(id);
  }
}
