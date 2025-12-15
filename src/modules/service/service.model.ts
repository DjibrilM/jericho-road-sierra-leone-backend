// src/products/product.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ServiceDocument = Service & Document;

@Schema({ timestamps: true })
export class Service {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ required: false })
  description: string;

  @Prop({ required: true })
  type:
    | 'laboratory'
    | 'others'
    | 'radiographie'
    | 'hospiralization'
    | 'maternity'
    | 'maternity laboratory'
    | 'echographie';
}

export const serviceSchema = SchemaFactory.createForClass(Service);
