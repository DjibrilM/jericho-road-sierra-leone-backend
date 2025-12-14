import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Schema as MongooseSchema } from 'mongoose';
import { Patient } from 'src/modules/patients/patient.model';
import { User } from 'src/modules/users/user.model';

@Schema({ timestamps: true })
export class Triage {
  @Prop()
  poid: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' })
  patientId: Patient;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  doctor: User;

  @Prop()
  TA: string;

  @Prop()
  PU: string;

  @Prop()
  Temperature: string;

  @Prop()
  saturometre: string;

  @Prop()
  complains: string;

  @Prop()
  attachedImages: string[];
}

export type TriageDocument = Triage & Document;

export const TriageSchema = SchemaFactory.createForClass(Triage);
