import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsObject,
} from 'class-validator';

export class CreateTriagePediatricDto {
  @IsMongoId()
  @IsNotEmpty()
  patientId: string;

  author: string;

  @IsObject()
  @IsOptional()
  CoronaVirusScreening?: Record<string, any>;

  @IsObject()
  @IsOptional()
  emergencySigns?: Record<string, any>;

  @IsNotEmpty()
  reason: string;

  @IsArray()
  @IsOptional()
  attachedImages?: string[];

  @IsNotEmpty()
  temperature: string;
}
