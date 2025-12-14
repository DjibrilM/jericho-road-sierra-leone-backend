import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from 'src/util/types';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop()
  secondName: string;

  @Prop({ required: false, unique: true })
  email: string;

  @Prop()
  profileImageUrl: string;

  @Prop()
  phoneNumber: string;

  @Prop({ required: true })
  salary: number;

  @Prop({ required: true })
  role: Role;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false, default: false })
  hasBiometrics: boolean;

  @Prop({ required: false, default: [] })
  faceReferenceImages: string[];

  @Prop({ default: 'morning' })
  shift: 'morning' | 'evening';
}

export const UserSchema = SchemaFactory.createForClass(User);
