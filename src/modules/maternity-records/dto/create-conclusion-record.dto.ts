import { IsString, IsArray, IsNotEmpty } from 'class-validator';

export class CreateConclusionRecordDto {
  @IsString()
  @IsNotEmpty()
  patient: string;

  @IsString()
  @IsNotEmpty()
  doctor: string;

  @IsString()
  @IsNotEmpty()
  assistant: string;

  @IsString()
  @IsNotEmpty()
  infirmiere: string;

  @IsString()
  @IsNotEmpty()
  conclusion: string;

  @IsArray()
  @IsNotEmpty()
  files: string[];

  @IsString()
  @IsNotEmpty()
  maternityRecord: string;
}
