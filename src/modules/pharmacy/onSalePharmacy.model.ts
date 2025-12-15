import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type onSaleMedecinDocument = HydratedDocument<onSaleMedecin>;

@Schema({ timestamps: true })
export class onSaleMedecin {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  price: string;

  @Prop({ required: true })
  quantity: number;
}

export const onsSaleMedecinSchema = SchemaFactory.createForClass(onSaleMedecin);
