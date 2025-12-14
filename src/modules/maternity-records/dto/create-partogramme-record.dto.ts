import { IsNotEmpty, IsString, IsArray, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { Schema } from '@nestjs/mongoose';

@Schema({ timestamps: true })
class createPartogrammeRecordDto {
  @IsNotEmpty()
  patient: string;

  @IsString()
  @IsNotEmpty()
  plaintes: string;

  @IsNotEmpty()
  assistant: string;

  @IsNotEmpty()
  infirmiere: string;

  @IsNotEmpty()
  doctor: string;

  @IsNotEmpty()
  @IsString()
  explication: string[];

  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  files: string[];

  @IsNotEmpty()
  record: string;
}

export default createPartogrammeRecordDto;
