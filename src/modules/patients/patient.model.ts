import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PatientDocument = HydratedDocument<Patient>;

@Schema({ timestamps: true })
export class Patient {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  secondName: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  birthdate: Date;

  @Prop({ required: true })
  emergencyContact: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  ProfilePicture: string;

  @Prop({ required: false })
  bloodGroup: string;

  @Prop({ required: false })
  weight: number;

  @Prop({ required: true })
  status: 'free' | 'subscriber' | 'paid';

  @Prop({ required: false })
  patientType:
    | 'Personnelle'
    | 'Normal'
    | 'NHC'
    | 'ECZ'
    | 'Coopérative Umoja Ni Nguvu'
    | 'ISIG'
    | 'MT'
    | 'Johanniter';
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
