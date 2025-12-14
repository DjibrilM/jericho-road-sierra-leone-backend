import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../users/user.model';
import { Patient } from '../patients/patient.model';

export type PresenceRecordDocument = HydratedDocument<PresenceModel>;

@Schema({ timestamps: true })
export class PresenceModel {
  @Prop({ required: true, ref: 'User', type: mongoose.Schema.Types.ObjectId })
  agent: User;

  @Prop({ default: '' })
  entered: string;

  @Prop({ default: '' })
  exited: string;

  @Prop({ default: 'morning' })
  shift: string;

  @Prop({ default: 'waiting' })
  verdict: 'absent' | 'presented' | 'waiting';
}

export const PresenceRecordSchema = SchemaFactory.createForClass(PresenceModel);
