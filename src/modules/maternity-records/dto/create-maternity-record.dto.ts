import { IsNotEmpty, IsString, IsArray, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

class CreateMaternityRecordDto {
  @IsNotEmpty()
  patient: string;

  @IsString()
  @IsNotEmpty()
  plaintes: string;

  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  admission: string[];

  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  surveillancePhaseActiveGte4cm: string[];

  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  accouchement: string[];

  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  surveillancePostPartumImmediatEtTardif: string[];

  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  SurveillanceDeLaPhaseDeLatence4cm: string[];
}

export default CreateMaternityRecordDto;
