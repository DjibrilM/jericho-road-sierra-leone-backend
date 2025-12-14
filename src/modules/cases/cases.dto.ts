import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested,IsOptional } from 'class-validator';

export class CreateCaseDto {
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  name: string;
}

export class CreateCaseRecordDto {
  @IsNotEmpty()
  case: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  patient: string;

  @IsOptional()
  record:string
}

export class CaseRecordsListDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCaseRecordDto)
  records: CreateCaseRecordDto[];
}
