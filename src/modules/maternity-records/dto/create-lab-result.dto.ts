import { IsNotEmpty, IsString, IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLabResultDto {
  @IsNotEmpty()
  @IsString()
  patient: string; // Patient ObjectId

  @IsNotEmpty()
  @IsString()
  requestedExaminationsReference: string; // LaboratoireRecord ObjectId

  @IsNotEmpty()
  @IsString()
  maternityRecord: string; // MaternityRecord ObjectId

  @IsNotEmpty()
  @IsString()
  doctor: string; // Doctor ObjectId

  @IsNotEmpty()
  @IsString()
  assistant: string; // Assistant ObjectId

  @IsNotEmpty()
  @IsString()
  infirmiere: string; // Infirmière ObjectId

  // --- Laboratory Result Fields ---
  @IsOptional()
  @IsString()
  groupeSanguin?: string;

  @IsOptional()
  @IsString()
  hematocrite?: string;

  @IsOptional()
  @IsString()
  tdrDuPaludisme?: string;

  @IsOptional()
  @IsString()
  grossesseExamen?: string;

  @IsOptional()
  @IsString()
  albumiurie?: string;

  @IsOptional()
  @IsString()
  rprPourSyphilis?: string;

  @IsOptional()
  @IsString()
  examenCytoBacteriologiqueUrines?: string;

  @IsOptional()
  @IsString()
  autresObservations?: string;

  // --- Attachments ---
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Type(() => String)
  files?: string[];


  @IsNotEmpty()
  @IsArray()
  verdicts: [];
}
