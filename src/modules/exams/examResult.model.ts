// src/your/requested-examen.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/modules/users/user.model';
import { Patient } from 'src/modules/patients/patient.model';

@Schema({ timestamps: true })
export class ExamResult extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
  })
  patientId: Patient;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  doctorId: User;

  @Prop({ required: true })
  result: string;

  @Prop({ required: true })
  examenDescription: string;

  @Prop({ required: true })
  diagnosis: string;

  @Prop({ required: true })
  attachedImages: string[];

  @Prop()
  origin: string;
}

export const ExamResultSchema = SchemaFactory.createForClass(ExamResult);
