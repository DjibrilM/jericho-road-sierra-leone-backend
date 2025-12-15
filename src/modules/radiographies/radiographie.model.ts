// radiographie.schema.ts
import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Patient } from 'src/modules/patients/patient.model';
import { User } from 'src/modules/users/user.model';

export type RadiographieDocument = Radiographie & mongoose.Document;

@Schema({ timestamps: true })
export class Radiographie {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  doctor: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  })
  patient: Patient;

  @Prop({ required: true })
  result: string;

  @Prop({ required: true })
  diagnosis: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], required: true })
  files: string[];
}

export const RadiographieSchema = SchemaFactory.createForClass(Radiographie);
