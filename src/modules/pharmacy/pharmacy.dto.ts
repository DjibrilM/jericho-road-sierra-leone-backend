import { IsNotEmpty, Min, isNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateMedecinDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  quantity: number;
}

export class TakeMedecinFromGlobalStoreDto {
  @IsNotEmpty()
  id: mongoose.Schema.Types.ObjectId | string;

  quanty: number;
}

export class sellGlobalStoreMedcineDto {
  @IsNotEmpty()
  id: mongoose.Schema.Types.ObjectId;
}
