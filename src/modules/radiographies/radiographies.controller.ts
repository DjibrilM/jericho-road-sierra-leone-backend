// radiographie.controller.ts
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
import { RadiographieService } from './radiographies.service';
import { CreateRadiographieDto } from './radiographies.dto';

@Controller('radiographie')
export class RadiographieController {
  constructor(private readonly radiographieService: RadiographieService) {}

  @Post()
  async create(@Body() createRadiographieDto: CreateRadiographieDto) {
    try {
      return await this.radiographieService.create(createRadiographieDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  @Get('all/:id')
  async findAll(@Param('id') id:string) {
    return await this.radiographieService.findAll(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.radiographieService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateRadiographieDto: CreateRadiographieDto) {
    try {
      return await this.radiographieService.update(id, updateRadiographieDto);
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
      return await this.radiographieService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
