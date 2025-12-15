import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type HospitalizationMedecinDocument = HydratedDocument<HospitalizationMedecine>;

@Schema({ timestamps: true })
export class HospitalizationMedecine {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  price: string;

  @Prop({ required: true })
  quantity: number;

  @Prop()
  description: string;
}

export const HospitalizationMedecinSchema =
  SchemaFactory.createForClass(HospitalizationMedecine);
