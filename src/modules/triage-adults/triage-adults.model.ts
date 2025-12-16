import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Schema as MongooseSchema } from 'mongoose';
import { Patient } from 'src/modules/patients/patient.model';
import { User } from 'src/modules/users/user.model';

@Schema({ timestamps: true })
export class TriageAdult {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' })
  patientId: Patient;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  author: User;

  @Prop({ default: [] })
  attachedImages: string[];

  @Prop({ type: Object, default: {} })
  CoronaVirusScreening: Record<string, any>;

  @Prop()
  reason: string;

  @Prop()
  temperature: string;
}

export type TriageDocument = TriageAdult & Document;
export const TriageSchema = SchemaFactory.createForClass(TriageAdult);
