
import { IsArray, IsNotEmpty } from 'class-validator';

class CreateLaboratoryInvoiceDto {
  @IsNotEmpty()
  @IsArray()
  services: string[];

  @IsNotEmpty()
  maternityRecord: string;
}

export default CreateLaboratoryInvoiceDto;
