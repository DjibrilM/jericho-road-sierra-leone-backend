import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CaseDocument = HydratedDocument<Case>;

@Schema({ timestamps: true })
export class Case {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;
}

export const CaseSchema = SchemaFactory.createForClass(Case);
