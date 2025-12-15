import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Mongoose, mongo } from 'mongoose';
import { Appointment, AppointmentDocument } from './appointment.model';
import { CreateAppointmentDto } from './appointment.dto';
import { InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
  ) {}

  async create(appointment: CreateAppointmentDto): Promise<Appointment> {
    try {
      const createdAppointment = new this.appointmentModel(appointment);
      return await createdAppointment.save();
    } catch (error) {
      throw new Error(`Failed to create appointment: ${error.message}`);
    }
  }

  async findAll(Patientid: string): Promise<Appointment[]> {
    try {
      const serializeId = new mongoose.Types.ObjectId(Patientid);
      return await this.appointmentModel
        .find({ patient: serializeId })
        .populate('doctor')
        .populate('patient')
        .sort({ createdAt: -1 })
        .exec();
    } catch (error) {
      console.log(error);
      throw new Error(`Failed to retrieve appointments: ${error.message}`);
    }
  }

  async findOne(id: string): Promise<Appointment> {
    try {
      const appointment = await this.appointmentModel
        .findById(id)
        .populate('doctor')
        .populate('patient')
        .exec();
      if (!appointment) {
        throw new NotFoundException('Appointment not found');
      }
      return appointment;
    } catch (error) {
      throw new Error(`Failed to retrieve appointment: ${error.message}`);
    }
  }

  async update(
    id: string,
    appointment: CreateAppointmentDto,
  ): Promise<Appointment> {
    try {
      const updatedAppointment = await this.appointmentModel
        .findByIdAndUpdate(id, appointment, { new: true })
        .exec();
      if (!updatedAppointment) {
        throw new NotFoundException('Appointment not found');
      }
      return updatedAppointment;
    } catch (error) {
      throw new Error(`Failed to update appointment: ${error.message}`);
    }
  }

  async remove(id: string): Promise<Appointment | unknown> {
    try {
      const removedAppointment = await this.appointmentModel
        .findByIdAndDelete(id)
        .exec();
      if (!removedAppointment) {
        throw new NotFoundException('Appointment not found');
      }
      return removedAppointment;
    } catch (error) {
      throw new Error(`Failed to remove appointment: ${error.message}`);
    }
  }

  async getDoctorAppointment(id: string) {
    try {
      const hash = new mongoose.Types.ObjectId(id);
      const data = await this.appointmentModel
        .find({ doctor: hash })
        .populate('doctor')
        .populate('patient')
        .sort({ createdAt: -1 })
        .exec();
      console.log(data);
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
