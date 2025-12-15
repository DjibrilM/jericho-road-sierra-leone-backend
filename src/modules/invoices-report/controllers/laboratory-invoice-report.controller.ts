import { Controller, Get, Query } from '@nestjs/common';
import { LaboratoryInvoicesReportService } from '../services/laboratory-invoice-report.service';

@Controller('laboratory-invoices-report')
export class LaboratoryInvoicesReportController {
  constructor(
    private readonly laboratoryInvoicesReportService: LaboratoryInvoicesReportService,
  ) {}

  @Get('by-date')
  async getByDate(
    @Query('filterType') filterType: 'day' | 'month' | 'year',
    @Query('date') date: string,
    @Query('invoicePatientType') invoicePatientType?: string,
  ) {
    return this.laboratoryInvoicesReportService.fetchByDate(
      filterType,
      date,
      invoicePatientType,
    );
  }

  @Get('by-interval')
  async getByInterval(
    @Query('from') fromDate: string,
    @Query('to') toDate: string,
    @Query('invoicePatientType') invoicePatientType?: string,
  ) {
    return this.laboratoryInvoicesReportService.fetchByDateInterval(
      fromDate,
      toDate,
      invoicePatientType,
    );
  }
}
