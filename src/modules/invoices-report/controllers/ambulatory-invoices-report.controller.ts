import { Controller, Get, Query } from '@nestjs/common';
import { AmbulatoryInvoicesReportService } from '../services/ambulatort-invoices-report.service';

@Controller('invoices')
export class InvoicesReportController {
  constructor(
    private readonly invoiceService: AmbulatoryInvoicesReportService,
  ) {}

  @Get('by-date')
  async getByDate(
    @Query('filterType') filterType: 'day' | 'month' | 'year',
    @Query('date') date: string,
    @Query('invoicePatientType') type?: string,
  ) {
    return this.invoiceService.fetchByDate(filterType, date, type);
  }

  @Get('by-interval')
  async getByInterval(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('invoicePatientType') type?: string,
  ) {
    return this.invoiceService.fetchByDateInterval(from, to, type);
  }
}
