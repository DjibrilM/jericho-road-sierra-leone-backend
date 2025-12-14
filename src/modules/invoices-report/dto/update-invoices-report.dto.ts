import { PartialType } from '@nestjs/mapped-types';
import { CreateInvoicesReportDto } from './create-invoices-report.dto';

export class UpdateInvoicesReportDto extends PartialType(CreateInvoicesReportDto) {}
