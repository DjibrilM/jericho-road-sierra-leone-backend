// src/maternity/dto/create-requested-exams.dto.ts
import { IsNotEmpty, IsString, IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRequestedExamsDto {
  @IsNotEmpty()
  @IsString()
  patient: string; // patient ObjectId

  @IsNotEmpty()
  @IsString()
  doctor: string; // doctor ObjectId

  @IsOptional()
  @IsString()
  requestedExams?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  services?: string[]; // Array of Service ObjectIds
}
