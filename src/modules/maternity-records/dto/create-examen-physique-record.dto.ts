import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsMongoId,
  IsNumber,
  IsArray,
} from 'class-validator';

export default class CreateExamenPhysiqueRecordDto {
  /** ---- Relations ---- */
  @IsMongoId()
  @IsNotEmpty()
  patient: string;

  @IsMongoId()
  @IsNotEmpty()
  doctor: string;

  @IsMongoId()
  @IsOptional()
  assistant?: string;

  @IsMongoId()
  @IsOptional()
  infirmiere?: string;

  @IsMongoId()
  @IsNotEmpty()
  record: string; // lien vers le MaternityRecord

  /** ---- Paramètres vitaux ---- */
  @IsOptional()
  @IsString()
  poids?: string; // en kg

  @IsOptional()
  @IsString()
  taille?: string; // en cm

  @IsOptional()
  @IsString()
  temperature?: string; // en °C

  @IsOptional()
  @IsString()
  pouls?: string; // bpm

  /** ---- Observations ---- */
  @IsOptional()
  @IsString()
  conjonctives?: string;

  @IsOptional()
  @IsString()
  etatGeneral?: string;

  /** ---- Systèmes ---- */
  @IsOptional()
  @IsString()
  systemeRespiratoire?: string;

  @IsOptional()
  @IsString()
  systemeCirculatoire?: string;

  @IsOptional()
  @IsString()
  systemeDigestif?: string;

  @IsOptional()
  @IsString()
  systemeUrinaire?: string;

  @IsOptional()
  @IsString()
  systemeLocomoteur?: string;

  @IsOptional()
  @IsString()
  systemeNerveux?: string;

  @IsOptional()
  @IsString()
  autre?: string;

  /** ---- Fichiers ---- */
  @IsArray()
  @IsOptional()
  files?: string[];
}
