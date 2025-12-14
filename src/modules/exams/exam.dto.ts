// src/your/create-requested-examen.dto.ts
import { IsNotEmpty } from 'class-validator';
import { Schema } from 'mongoose';

export class CreateRequestedExamenDto {
  @IsNotEmpty()
  patientId: Schema.Types.ObjectId;

  @IsNotEmpty()
  doctorId: Schema.Types.ObjectId;

  @IsNotEmpty()
  examenDescription: string;

  @IsNotEmpty()
  origin: string;
}

export class createExamReusltDto {
  @IsNotEmpty()
  patientId: string;

  @IsNotEmpty()
  doctorId: string;

  @IsNotEmpty()
  result: string;

  @IsNotEmpty()
  examenDescription: string;

  @IsNotEmpty()
  diagnosis: string;

  @IsNotEmpty()
  attachedImages: string[];

  @IsNotEmpty()
  origin: string;
}
