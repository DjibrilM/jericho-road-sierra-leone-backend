
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  ConflictException,
  Put,
  Delete,
} from '@nestjs/common';
import { EchographieService } from './echographies.service'; // Changed from RadiographieService
import { CreateEchographieDto } from './echographies.dto'; // Changed from CreateRadiographieDto

@Controller('echographie')
export class EchographieController { // Changed from RadiographieController
  constructor(private readonly echographieService: EchographieService) { // Changed from radiographieService
  }

  @Post()
  async create(@Body() createEchographieDto: CreateEchographieDto) { // Changed from CreateRadiographieDto
    try {
      return await this.echographieService.create(createEchographieDto); // Changed from radiographieService
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  @Get('all/:id')
  async findAll(@Param('id') id: string) {
    return await this.echographieService.findAll(id); // Changed from radiographieService
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.echographieService.findOne(id); // Changed from radiographieService
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateEchographieDto: CreateEchographieDto) { // Changed from CreateRadiographieDto
    try {
      return await this.echographieService.update(id, updateEchographieDto); // Changed from radiographieService
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.echographieService.remove(id); // Changed from radiographieService
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
