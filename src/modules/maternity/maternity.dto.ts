import { IsNotEmpty, IsString } from 'class-validator';
import { Survey } from './dailyRecord.model';
import { Prop } from '@nestjs/mongoose';

export class CreateMaternityRecord {
  @IsNotEmpty()
  @IsString()
  doctor: string;

  @IsNotEmpty()
  @IsString()
  patient: string;

  @IsNotEmpty()
  @IsString()
  plaintes: string;

  @IsNotEmpty()
  @IsString()
  historiqueMaladie: string;

  @IsNotEmpty()
  @IsString()
  antecedents: string;

  @IsNotEmpty()
  @IsString()
  examenPhysique: string;

  @IsNotEmpty()
  @IsString()
  systemeRespiratoire: string;

  @IsNotEmpty()
  @IsString()
  systemePulmonaire: string;

  @IsNotEmpty()
  @IsString()
  systemeGastroIntestinal: string;

  @IsNotEmpty()
  @IsString()
  systemeNeurologique: string;

  @IsNotEmpty()
  @IsString()
  systemeGenitauxUrinaire: string;

  @IsNotEmpty()
  @IsString()
  systemeLocomoteur: string;

  @IsNotEmpty()
  @IsString()
  room: string;

  @IsNotEmpty()
  @IsString()
  diagnosticDifferentiel: string;

  depositHistory: [];
}

export class createDailySurveyDto {
  @IsNotEmpty()
  MaternityRecord: string;

  @IsNotEmpty()
  patient: string;

  @IsNotEmpty()
  doctor: string;

  @IsNotEmpty()
  attachedImages: string[];

  @IsNotEmpty()
  morningSurvey: Survey;

  @Prop()
  afternoonSurvey: Survey;

  @Prop()
  eveningSurvey: Survey;
}

export class CreateMaternityRecordPaymentDto {
  senderId: string;

  @IsNotEmpty()
  patientId: string;

  MaternityRecordId: string;

  @IsNotEmpty()
  payementMethod: string;

  @IsNotEmpty()
  discount: number;
}

export class CreateMaternityRecommendationDto {
  @IsNotEmpty()
  patient: string;

  @IsNotEmpty()
  sender: string;

  @IsNotEmpty()
  MaternityRecord: string;

  @IsNotEmpty()
  recommandedMedicine: {
    selectedMedecine: {
      _id: string;
      name: string;
      price: string;
      quantity: number;
      description: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
      checked: boolean;
    };
    quantity: string;
    dosagequantity: string;
    instruction: string;
    selectedDosage: { name: string; checked: boolean }[];
    id: string;
  }[];
}

export class UpdateMaternityDepositHistoryDto {
  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  createdAt: string;
}

export class UpdateMaternityPackageAmount {
  @IsNotEmpty()
  amount: number;
}
