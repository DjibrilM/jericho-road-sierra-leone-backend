import { IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateMedicalRecordDto {
  @IsNotEmpty()
  patientId: mongoose.Schema.Types.ObjectId;

  doctorId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  complains: string;

  @IsNotEmpty()
  prescribeMedecin: any[];

  @IsNotEmpty()
  Teteetcou: string;

  @IsNotEmpty()
  Thorax: string;

  @IsNotEmpty()
  Abdomen: string;

  @IsNotEmpty()
  ApparreilLocomoteur: string;

  @IsNotEmpty()
  ExaenOrl: string;

  Diagnosis: string;

  @IsNotEmpty()
  Treatments: string[];

  @IsNotEmpty()
  attachedImages: string[];

  @IsNotEmpty()
  historyOfTheDisease: string;

  @IsNotEmpty()
  antecedent: string;

  @IsNotEmpty()
  etatGeneral: string;

  @IsNotEmpty()
  complémentdanamnèse: string;
}

export class CreateTriageDto {
  @IsNotEmpty()
  caseId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  weight: number;

  @IsNotEmpty()
  TA: string;

  @IsNotEmpty()
  PU: string;

  @IsNotEmpty()
  Temperature: number;

  @IsNotEmpty()
  patientHeight: number;

  @IsNotEmpty()
  SATUROMAITRE: string;

  @IsNotEmpty()
  doctor: string;

  @IsNotEmpty()
  complain: string;
}

export class AddCaseTestDto {
  @IsNotEmpty()
  caseId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  tests: string[];
}

export class UpdateDiscountDto {
  discount: number;
}

export class CreatePayementDto {
  @IsNotEmpty()
  invoiceId: string;

  @IsNotEmpty()
  patientId: string;

  @IsNotEmpty()
  payementMethod: string;
}

export class UpdateMedicalRecordDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  diagnosis: string;

  @IsNotEmpty()
  Treatments: string[];

  @IsNotEmpty()
  prescribeMedecin: any[];

  @IsNotEmpty()
  senderId: string;

  @IsNotEmpty()
  priseEnCharge: string;
}
