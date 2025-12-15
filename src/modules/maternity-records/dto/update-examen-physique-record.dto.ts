import { PartialType } from '@nestjs/mapped-types';
import CreateExamenPhysiqueRecordDto from './create-examen-physique-record.dto';

export default class UpdateExamenPhysiqueRecordDto extends PartialType(
  CreateExamenPhysiqueRecordDto,
) {}
