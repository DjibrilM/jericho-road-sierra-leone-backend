// src/your/requested-examen.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/modules/users/user.model';
import { Patient } from 'src/modules/patients/patient.model';

@Schema({ timestamps: true })
export class Exam extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
  })
  patientId: Patient;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  doctorId: User;

  @Prop({ default: false, type: Boolean })
  addedServices: false;

  @Prop({ required: true })
  examenDescription: string;
}

export const ExamSchema = SchemaFactory.createForClass(Exam);
