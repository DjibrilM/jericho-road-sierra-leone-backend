import { Prop } from "@nestjs/mongoose";
import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type TypesDocument = HydratedDocument<Types>;

@Schema({ timestamps: true })
export class Types {
  @Prop({ required: true, unique: true })
  name: string;
}

export const TypesSchema = SchemaFactory.createForClass(Types);