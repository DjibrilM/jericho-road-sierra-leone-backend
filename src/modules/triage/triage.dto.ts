import { IsNotEmpty, isNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateTriageDto {
  @IsNotEmpty()
  poid: number;

  @IsNotEmpty()
  doctor: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  patientId: string;

  @IsNotEmpty()
  TA: string;

  @IsNotEmpty()
  PU: string;

  @IsNotEmpty()
  Temperature: string;

  @IsNotEmpty()
  saturometre: string;

  @IsNotEmpty()
  complains: string;

  attachedImages: string;

  @IsNotEmpty()
  aptitudePhysique: boolean;
}

export class CreateAptitudePhysiquePayment {
  @IsNotEmpty()
  id: string;
}
