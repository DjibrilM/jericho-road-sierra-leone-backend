import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class History extends Document {
  @Prop({ required: true }) action: string;
  @Prop({ required: true }) details: string;
  @Prop({ default: 'Record creation' }) reason: string;
  @Prop({ required: true }) itemId: string;
  @Prop({ default: () => new Date().toLocaleString() }) timestamp: string;
}

export const HistorySchema = SchemaFactory.createForClass(History);
