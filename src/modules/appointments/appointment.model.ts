import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';
import { Patient } from 'src/modules/patients/patient.model';
import { User } from 'src/modules/users/user.model';

@Schema({ timestamps: true })
export class Appointment extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Patient',
  })
  patient: Patient;

  @Prop({ type: String, required: true })
  visitDate: string;

  @Prop({ type: String, required: true })
  startTime: string;

  @Prop({ type: String, required: true })
  endTime: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
  doctor: User;

  @Prop({ type: String, required: true })
  description: string;
}

export type AppointmentDocument = Appointment & Document;

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
