import { IsNotEmpty } from 'class-validator';

class CreatRequestedServicesInvoiceDto {
  @IsNotEmpty()
  patientId: string;

  @IsNotEmpty()
  selectedServices: any[];
}

export default CreatRequestedServicesInvoiceDto;
