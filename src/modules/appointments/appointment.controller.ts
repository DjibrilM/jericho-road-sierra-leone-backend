import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { Appointment } from './appointment.model';
import { CreateAppointmentDto } from './appointment.dto';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  async create(
    @Body() appointment: CreateAppointmentDto,
  ): Promise<Appointment> {
    try {
      return await this.appointmentService.create(appointment);
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('all/:id')
  async findAll(@Param() id: string): Promise<Appointment[]> {
    try {
      return await this.appointmentService.findAll(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Appointment> {
    try {
      return await this.appointmentService.findOne(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('update/:id')
  async update(
    @Param('id') id: string,
    @Body() appointment: CreateAppointmentDto,
  ): Promise<Appointment> {
    try {
      return await this.appointmentService.update(id, appointment);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<unknown> {
    try {
      return await this.appointmentService.remove(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('agent/:doctorId')
  async agentAppointment(@Param('doctorId') doctorId: string) {
    return await this.appointmentService.getDoctorAppointment(doctorId);
  }
}
