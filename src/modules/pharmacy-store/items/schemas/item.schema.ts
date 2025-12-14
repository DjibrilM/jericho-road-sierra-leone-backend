import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/modules/users/user.model';

export type ItemDocument = HydratedDocument<Item>;

@Schema({ timestamps: true })
export class Item {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  patientId: User;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  expiry: string;
  @Prop({ default: () => new Date().toISOString().split('T')[0] }) date: string;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
