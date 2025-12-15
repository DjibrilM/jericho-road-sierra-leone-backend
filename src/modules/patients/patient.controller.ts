import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto, SearchByName } from './patient.dto';
import mongoose from 'mongoose';
import { query } from 'express';

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get('filterByDate')
  async filterPatientByDate(@Query('date') date: Date) {
    return await this.patientService.fingPatientByDate(date);
  } 

  @Get('count')
  async countDocument(@Query('patientType') patientType: string) {
    return await this.patientService.getPatientsCounts(patientType);
  }

  @Post()
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientService.create(createPatientDto);
  }

  @Get('today')
  findByToday(@Query('patientType') patientType: string) {
    return this.patientService.findByToday(patientType);
  }

  @Get('months')
  getByMonth(@Query('patientType') patientType: string) {
    return this.patientService.findByCurrentMonth(patientType);
  }

  @Get('years')
  getByYear(@Query('patientType') patientType: string) {
    return this.patientService.getPatientsRecordedThisYear(patientType);
  }

  @Get()
  findAll(
    @Query('skip') paginationSkip: number,
    @Query('patientType') patientType: string,
  ) {
    return this.patientService.findAll(paginationSkip, patientType);
  }

  @Get(':id')
  findOne(@Param('id') id: mongoose.Schema.Types.ObjectId) {
    return this.patientService.findOne(id);
  }
  @Delete(':id')
  remove(@Param('id') id: mongoose.Schema.Types.ObjectId) {
    return this.patientService.remove(id);
  }

  @Post('searchByName')
  searchPatient(@Body() body: SearchByName) {
    return this.patientService.searchPatientByName(body.name);
  }
}
