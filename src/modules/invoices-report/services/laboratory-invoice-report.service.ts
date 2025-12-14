import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  LaboratoryInvoice,
  LaboratoryInvoiceDocument,
} from 'src/modules/exams/labororatoryInvoice.model';

@Injectable()
export class LaboratoryInvoicesReportService {
  constructor(
    @InjectModel(LaboratoryInvoice.name)
    private readonly invoiceModel: Model<LaboratoryInvoiceDocument>,
  ) {}

  async fetchByDate(
    filterType: 'day' | 'month' | 'year',
    dateString: string,
    invoicePatientType?: string,
  ) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) throw new Error('Invalid date');

    let start: Date;
    let end: Date;

    if (filterType === 'day') {
      start = new Date(date.setHours(0, 0, 0, 0));
      end = new Date(date.setHours(23, 59, 59, 999));
    } else if (filterType === 'month') {
      start = new Date(date.getFullYear(), date.getMonth(), 1);
      end = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      );
    } else {
      start = new Date(date.getFullYear(), 0, 1);
      end = new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);
    }

    const match: any = { createdAt: { $gte: start, $lte: end } };
    if (invoicePatientType) match.invoicePatientType = invoicePatientType;

    const invoices = await this.invoiceModel
      .find(match)
      .populate(
        'patientId',
        '-password -salary -email -phoneNumber -address -emergencyContact -ProfilePicture -__v -updatedAt',
      )
      .populate(
        'senderId',
        '-password -salary -email -phoneNumber -role -__v -updatedAt',
      )
      .lean();

    const totalAmount = this.calculateTotal(invoices);

    return {
      metadata: {
        totalAmount,
        count: invoices.length,
        filter: { filterType, dateString, invoicePatientType },
      },
      invoices,
    };
  }

  async fetchByDateInterval(
    fromDate: string,
    toDate: string,
    invoicePatientType?: string,
  ) {
    const from = new Date(fromDate);
    const to = new Date(toDate);

    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      throw new Error('Invalid date range');
    }

    const match: any = { createdAt: { $gte: from, $lte: to } };
    if (invoicePatientType) match.invoicePatientType = invoicePatientType;

    const invoices = await this.invoiceModel
      .find(match)
      .populate(
        'patientId',
        '-password -salary -email -phoneNumber -address -emergencyContact -ProfilePicture -__v -updatedAt',
      )
      .populate(
        'senderId',
        '-password -salary -email -phoneNumber -role -__v -updatedAt',
      )
      .lean();

    const totalAmount = this.calculateTotal(invoices);

    return {
      metadata: {
        totalAmount,
        count: invoices.length,
        filter: { fromDate, toDate, invoicePatientType },
      },
      invoices,
    };
  }

  private calculateTotal(invoices: any[]): number {
    return invoices.reduce((sum, invoice) => {
      // Sum the total of all services in the invoice
      const servicesTotal =
        invoice.services?.reduce(
          (acc, s) => acc + (s.total || s.price || 0),
          0,
        ) || 0;

      // Apply discount if available
      const discount = invoice.discount || 0;
      const invoiceTotal = servicesTotal - discount;

      return sum + invoiceTotal;
    }, 0);
  }
}
