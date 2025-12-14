import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MedecinDocument = HydratedDocument<Medecine>;

@Schema({ timestamps: true })
export class Medecine {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  price: string;

  @Prop({ required: true })
  quantity: number;

  @Prop()
  description: string
}

export const MedecinSchema = SchemaFactory.createForClass(Medecine);
