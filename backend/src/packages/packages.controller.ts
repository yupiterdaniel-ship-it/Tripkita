import {
  Controller, Get, Post, Put, Delete, Patch,
  Param, Body, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { PackagesService } from './packages.service';
import { CreatePackageDto, UpdatePackageDto } from './packages.dto';

@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  /** GET /packages?category=Beach */
  @Get()
  findAll(@Query('category') category?: string) {
    return this.packagesService.findAll(category);
  }

  /** GET /packages/categories */
  @Get('categories')
  getCategories() {
    return this.packagesService.getCategories();
  }

  /** GET /packages/:id */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.packagesService.findOne(id);
  }

  /** POST /packages */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreatePackageDto) {
    return this.packagesService.create(dto);
  }

  /** PUT /packages/:id */
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePackageDto) {
    return this.packagesService.update(id, dto);
  }

  /** PATCH /packages/:id */
  @Patch(':id')
  patch(@Param('id') id: string, @Body() dto: UpdatePackageDto) {
    return this.packagesService.update(id, dto);
  }

  /** DELETE /packages/:id */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.packagesService.remove(id);
  }
}
