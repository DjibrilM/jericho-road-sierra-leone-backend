import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsObject,
} from 'class-validator';

export class CreateTriageAdultDto {
  @IsMongoId()
  @IsNotEmpty()
  patientId: string;

  author: string;

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
