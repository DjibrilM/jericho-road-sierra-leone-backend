import { IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateAppointmentDto {
  @IsNotEmpty()
  patient: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  visitDate: string;

  @IsNotEmpty()
  startTime: string;

  @IsNotEmpty()
  endTime: string;

  @IsNotEmpty()
  doctor: string;

  @IsNotEmpty()
  description: string;
}
