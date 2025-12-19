import { IsNotEmpty, IsString } from 'class-validator';
import { Survey } from './dailyRecord.model';
import { Prop } from '@nestjs/mongoose';

export class CreateSurgeryRecord {
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
  SurgeryRecord: string;

  @IsNotEmpty()
  patient: string;

  @IsNotEmpty()
  doctor: string;

  @IsNotEmpty()
  attachedImages: string[];

  @IsNotEmpty()
  morningSurvery: Survey[];

  @Prop()
  afternoonSurvery: Survey[];

  @Prop()
  eveningSurvery: Survey[];
}

export class CreateSurgeryRecordPaymentDto {
  senderId: string;

  @IsNotEmpty()
  patientId: string;

  SurgeryRecordId: string;

  @IsNotEmpty()
  payementMethod: string;

  @IsNotEmpty()
  discount: number;
}

export class CreateSurgeryRecommendationDto {
  @IsNotEmpty()
  patient: string;

  @IsNotEmpty()
  sender: string;

  @IsNotEmpty()
  SurgeryRecord: string;

  @IsNotEmpty()
  recommandedMedicine: {
    selectedMedecine: {
      _id: string;
      name: string;
      price: string;
      quantity: 1;
      description: 'telmisartan';
      createdAt: '2024-05-16T12:53:49.927Z';
      updatedAt: '2024-05-16T12:53:49.927Z';
      __v: 0;
      checked: true;
    };
    quantity: string;
    dosagequantity: string;
    instruction: string;
    selectedDosage: { name: string; checked: boolean }[];
    id: '2024-07-09T09:59:42.263Z';
  }[];
}

export class UpdateSurgeryDepositHistoryDto {
  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  createdAt: string;
}

export class UpdateSurgeryPackageAmount {
  @IsNotEmpty()
  amount: number;
}
