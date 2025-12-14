import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import mongoose from 'mongoose';

import { HospitalServices } from './service.service';
import { CreateServiceDto } from './service.dto';
import { UpdateServiceDto } from './service.dto';
import { AuthGuard } from 'src/middlewares/auth.guard';

@Controller('service')
@UseGuards(AuthGuard)
export class ServiceController {
  constructor(private readonly hospitalServices: HospitalServices) {}

  @Post()
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.hospitalServices.create(createServiceDto);
  }

  @Get()
  findAll() {
    return this.hospitalServices.findAll();
  }

  @Get('laboratory')
  async findLaborotoryServices() {
    return await this.hospitalServices.findLaboratoryServices();
  }

  @Get('hospitalization')
  async findhospitalServices() {
    return await this.hospitalServices.findHospitalizationService();
  }

  @Get('echographie')
  async findEchographieServices() {
    return await this.hospitalServices.getEchographyServices();
  }

  @Get('ambulatory-examination-services')
  async getAmbulatoryExaminationServices() {
    return await this.hospitalServices.getAmabulatoryExaminationServices();
  }

  @Get('radiographie')
  async findRadiographieServices() {
    return await this.hospitalServices.getRadiographieServices();
  }

  @Get('maternity-laboratory')
  async findMaternityLaboratoryServices() {
    return await this.hospitalServices.findMaternityLaboratoryServices();
  }

  @Get('medicalRecord')
  async findMedicalRecordServices() {
    return await this.hospitalServices.findMedicalRecordSerives();
  }

  @Get(':id')
  findOne(@Param('id') id: mongoose.Schema.Types.ObjectId) {
    return this.hospitalServices.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: mongoose.Schema.Types.ObjectId,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return this.hospitalServices.update(id, updateServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: mongoose.Schema.Types.ObjectId) {
    return this.hospitalServices.remove(id);
  }
}
