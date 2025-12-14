import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { LaboratoryInvoice } from 'src/modules/exams/labororatoryInvoice.model';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema({ timestamps: true })
export class Payment {
  @Prop({
    ref: 'Invoice',
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  invoice: LaboratoryInvoice;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'cash', enum: ['cash', 'mobile', 'card', 'insurance'] })
  method: string;

  @Prop()
  receivedBy?: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
