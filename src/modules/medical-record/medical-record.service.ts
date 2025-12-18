import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import mongoose from 'mongoose';
import * as PDFDocument from 'pdfkit';

import { Response } from 'express';

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CreateMedicalRecordDto,
  CreatePayementDto,
  UpdateMedicalRecordDto,
} from './medical-record.dto';

import { MedicalRecord } from './medical-record.model';
import { Payement } from './payement.model';
import { Invoice } from './invoice.modal';
import { Medecine } from 'src/modules/pharmacy/pharmacy.model';
import { Service } from 'src/modules/service/service.model';
import { Patient } from '../patients/patient.model';
import { SoldMedicineModel } from '../pharmacy/soldMedicine';

@Injectable()
export class MedicalRecordService {
  constructor(
    @InjectModel(MedicalRecord.name)
    private mdeicalRecordSchema: Model<MedicalRecord>,
    @InjectModel(Invoice.name)
    private InvoiceModal: Model<Invoice>,
    @InjectModel(Payement.name)
    private payementModal: Model<Payement>,
    @InjectModel(Service.name)
    private servicetModal: Model<Service>,
    @InjectModel(Medecine.name)
    private medecinModal: Model<Medecine>,

    @InjectModel(Patient.name)
    private patientModal: Model<Patient>,

    @InjectModel(SoldMedicineModel.name)
    private soldMedicineModel: Model<SoldMedicineModel>,
  ) {}

  transformTreatments = async (createCaseDto: any) => {
    let treatments: any = [...createCaseDto];

    const treatmentsTrans = await Promise.all(
      treatments.map(async (item: string) => {
        const find = await this.servicetModal.findById(item);
        return find;
      }),
    );

    return treatmentsTrans;
  };

  transformprescribeMedecin = async (
    createCaseDto: any,
    user?: string,
    from?: string,
  ) => {
    let prescribeMedecin: any = [...createCaseDto];

    if (prescribeMedecin.length <= 0) return [];

    const prescribeMedecinTrans = await Promise.all(
      prescribeMedecin.map(async (item: any) => {
        const medicine = await this.medecinModal.findById(item.id);

        await this.soldMedicineModel.create({
          quantity: item.quantity,
          price: medicine.price,
          patientId: user,
          from: from,
          origin: 'ambulatory',
          medicineName: medicine.name,
        });

        return {
          ...item,
          id: medicine,
        };
      }),
    );

    return prescribeMedecinTrans;
  };

  async createRecord(createCaseDto: CreateMedicalRecordDto) {
    try {
      const patient = await this.patientModal.findById(createCaseDto.patientId);
      const newCase = await this.mdeicalRecordSchema.create({
        ...createCaseDto,
        complémentdanamnèse: createCaseDto.complémentdanamnèse,
        prescribeMedecin: [],
        Treatments: [],
        patientType: patient.patientType || '',
      });

      return newCase;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('failed to create record');
    }
  }

  async updateRecord(
    updateMedicalRecord: UpdateMedicalRecordDto,
  ): Promise<string> {
    const record = await this.mdeicalRecordSchema.findById(
      updateMedicalRecord.id,
    );

    // if (record.locked)
    //   throw new UnauthorizedException('this record has been locked');

    const treatmentsTrans = await this.transformTreatments(
      updateMedicalRecord.Treatments,
    );

    const find = await this.mdeicalRecordSchema.findById({
      _id: updateMedicalRecord.id,
    });

    const prescribeMedecinTrans = await this.transformprescribeMedecin(
      updateMedicalRecord.prescribeMedecin,
      find.patientId as any,
      find.doctorId as any,
    );

    await this.mdeicalRecordSchema.findOneAndUpdate(
      { _id: updateMedicalRecord.id },
      {
        priseEnCharge: updateMedicalRecord.priseEnCharge,
        prescribeMedecin: [...(prescribeMedecinTrans as any)],
        Diagnosis: updateMedicalRecord.diagnosis,
        Treatments: [...(treatmentsTrans as any)],
        locked: true,
      },
    );

    await this.InvoiceModal.create({
      patientId: record.patientId,
      senderId: updateMedicalRecord.senderId,
      prescribeMedecin: [...(prescribeMedecinTrans as any)],
      Treatments: [...(treatmentsTrans as any)],
      attachedMedicalRecordId: record._id,
    });

    return 'record updated';
  }

  async updateInvoice(createCaseDto: CreateMedicalRecordDto) {
    try {
      return await this.InvoiceModal.findOneAndUpdate(createCaseDto);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('failed to create record');
    }
  }

  async getRecord(id: mongoose.Schema.Types.ObjectId) {
    try {
      const record = await this.mdeicalRecordSchema
        .findById(id)
        .populate('patientId')
        .populate('doctorId');

      if (!record) throw new Error('record not found');
      return record;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async getRecords(id: mongoose.Schema.Types.ObjectId) {
    try {
      const records = await this.mdeicalRecordSchema
        .find({ patientId: id })
        .populate('patientId')
        .populate('doctorId')
        .sort({ createdAt: -1 })
        .exec();

      return { medicalRecords: records };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async deleteRecord(id: mongoose.Schema.Types.ObjectId) {
    try {
      if (!id) throw new BadRequestException();

      const findRecord = await this.mdeicalRecordSchema.findByIdAndDelete(id);
      await this.InvoiceModal.findOneAndDelete({
        attachedMedicalRecordId: findRecord.id,
      });
      if (!findRecord) {
        throw new Error('record not found');
      }
    } catch (error) {
      throw new InternalServerErrorException('failed to delete record');
    }
  }

  async getInvoices(patientId: string) {
    try {
      const data = await this.InvoiceModal.find({ patientId: patientId })
        .populate('patientId')
        .populate('senderId')
        .sort({ createdAt: -1 });

      return data;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async downloadInvoicePDF(attachedMedicalRecordId: string, res: Response) {
    const invoice = await this.getInvoice(attachedMedicalRecordId);

    if (!invoice) throw new NotFoundException('Invoice not found');

    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');

    res.setHeader(
      'Content-Disposition',

      `attachment; filename=invoice-${invoice.patientId.fullName}.pdf`,
    );

    doc.pipe(res);

    // --- Header ---

    doc

      .fontSize(22)

      .text('Medical Invoice', { align: 'center', underline: true });

    doc.moveDown(2);

    // --- Patient Info ---

    const patient = invoice.patientId;

    doc.fontSize(12).text(`Patient Name: ${patient.fullName}`);

    doc.text(`Gender: ${patient.gender}`);

    doc.text(`Birthdate: ${new Date(patient.birthdate).toLocaleDateString()}`);

    doc.text(`Phone: ${patient.phoneNumber}`);

    doc.text(`Address: ${patient.address}`);

    doc.moveDown();

    // --- Sender Info ---

    const sender = invoice.senderId;

    doc.text(`Processed by: ${sender.firstName} ${sender.secondName}`);

    doc.text(`Role: ${sender.role}`);

    doc.text(`Phone: ${sender.phoneNumber}`);

    doc.moveDown(2);

    // --- Treatments Table ---

    if (invoice.Treatments?.length) {
      doc.fontSize(14).text('Treatments', { underline: true });

      doc.moveDown(0.5);

      const tableTop = doc.y;

      const itemX = 50,
        typeX = 250,
        priceX = 400,
        rowHeight = 20;

      // Table header

      doc.fontSize(12).text('No.', itemX, tableTop);

      doc.text('Name', itemX + 30, tableTop);

      doc.text('Type', typeX, tableTop);

      doc.text('Price', priceX, tableTop);

      doc.moveDown();

      doc

        .moveTo(itemX, tableTop + 15)

        .lineTo(500, tableTop + 15)

        .stroke();

      let treatmentsTotal = 0;

      invoice.Treatments.forEach((treatment, idx) => {
        const y = tableTop + 20 + idx * rowHeight;

        doc.text(`${idx + 1}`, itemX, y);

        doc.text(treatment.name, itemX + 30, y);

        doc.text(treatment.type, typeX, y);

        doc.text(`${treatment.price} USD`, priceX, y);

        treatmentsTotal += Number(treatment.price);
      });

      doc.moveDown(2);

      doc

        .fontSize(12)

        .text(`Treatments Total: ${treatmentsTotal} USD`, { align: 'right' });

      doc.moveDown();
    }

    // --- Prescribed Medications Table ---

    if (invoice.prescribeMedecin?.length) {
      doc

        .fontSize(14)

        .text('Prescribed Medications', { underline: true, align: 'left' });

      doc.moveDown(0.5);

      const tableTop = doc.y;

      const itemX = 50,
        medX = 80,
        qtyX = 300,
        priceX = 370,
        rowHeight = 20;

      // Table header

      doc.fontSize(12).text('No.', itemX, tableTop);

      doc.text('Medicine', medX, tableTop);

      doc.text('Qty', qtyX, tableTop);

      doc.text('Price', priceX, tableTop);

      doc.moveDown();

      doc

        .moveTo(itemX, tableTop + 15)

        .lineTo(500, tableTop + 15)

        .stroke();

      let medsTotal = 0;

      invoice.prescribeMedecin.forEach((prescription, idx) => {
        const med = prescription.id;

        const y = tableTop + 20 + idx * rowHeight;

        doc.text(`${idx + 1}`, itemX, y);

        doc.text(med.name, medX, y);

        doc.text(`${prescription.quantity}`, qtyX, y);

        doc.text(`${Number(med.price).toFixed(2)} USD`, priceX, y);

        medsTotal += Number(med.price) * prescription.quantity;
      });

      doc.moveDown(2);

      doc

        .fontSize(12)

        .text(`Medications Total: ${medsTotal.toFixed(2)} USD`, {
          align: 'right',
        });

      doc.moveDown();
    }

    // --- Total Amount ---

    const totalAmount =
      (invoice.Treatments?.reduce((acc, t) => acc + Number(t.price), 0) || 0) +
      (invoice.prescribeMedecin?.reduce(
        (acc, p) => acc + Number(p.id.price) * p.quantity,

        0,
      ) || 0);

    doc.fontSize(14).text(`Total Amount: ${totalAmount.toFixed(2)} USD`, {
      align: 'right',

      bold: true,
    });

    doc.moveDown(2);

    // --- Footer ---

    doc

      .fontSize(10)

      .text(
        `Invoice generated at: ${new Date(invoice.createdAt).toLocaleString()}`,

        { align: 'center' },
      );

    doc.end();
  }

  async updateDiscount(id: string, discount: number) {
    try {
      return await this.InvoiceModal.findByIdAndUpdate(id, {
        discount: discount,
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to update discount');
    }
  }

  async getInvoice(attachedMedicalRecordId: string) {
    try {
      const objectId = new mongoose.Types.ObjectId(attachedMedicalRecordId);
      return await this.InvoiceModal.findOne({
        attachedMedicalRecordId: objectId,
      })
        .populate('patientId')
        .populate('senderId')
        .sort({ createdAt: -1 });
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async createPayament(data: CreatePayementDto, senderId: string) {
    try {
      const findInvoice = await this.InvoiceModal.findById(data.invoiceId);
      if (!findInvoice) throw new UnauthorizedException('Invoice not found');

      const payement = await this.payementModal.create({
        Treatments: [...findInvoice.Treatments],
        attachedMedicalRecordId: findInvoice.attachedMedicalRecordId,
        prescribeMedecin: [...findInvoice.prescribeMedecin],
        discount: findInvoice.discount,
        patientId: data.patientId,
        payementMethod: data.payementMethod,
        senderId: senderId,
      });

      findInvoice.locked = true;
      findInvoice.save();

      return payement;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getPatientPayements(patientId: string) {
    try {
      return await this.payementModal
        .find({ patientId: patientId })
        .populate('patientId')
        .populate('senderId')
        .sort({ createdAt: -1 });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getPayement(id: string) {
    try {
      return await this.payementModal
        .findOne({ attachedMedicalRecordId: id })
        .populate('patientId')
        .populate('senderId');
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findAllWithPagination(skip: number) {
    try {
      const payments = await this.payementModal
        .find()
        .populate('patientId')
        .populate('senderId')
        .skip((skip - 1) * 10)
        .limit(10)
        .sort({ createdAt: -1 });

      return payments;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getPaymentDocumentCount() {
    try {
      return await this.payementModal.find().countDocuments();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getDailPayment() {
    try {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0); // Set the time to the beginning of the day

      return await this.payementModal
        .find({
          createdAt: { $gte: today },
        })
        .countDocuments()
        .exec();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getMounthPayment() {
    try {
      const today = new Date();
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1,
      );

      const count = await this.payementModal
        .find({
          createdAt: { $gte: firstDayOfMonth },
        })
        .countDocuments()
        .exec();

      return count;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getYearPayments() {
    try {
      const today = new Date();
      const firstDayOfYear = new Date(today.getFullYear(), 0, 1);

      return this.payementModal
        .find({
          createdAt: { $gte: firstDayOfYear },
        })
        .countDocuments()
        .exec();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  //=========== ALL THE BELLOW CODE IS ABOUT FILTERING AMBILATORY PATIENTS =========//
  async findPatientByName(nameSegment: string) {
    try {
      const find = this.mdeicalRecordSchema
        .find()
        .populate({
          path: 'patientId',
          match: {
            fullName: { $regex: nameSegment.toUpperCase(), $options: 'i' },
          },
        })
        .exec();

      const filterPatient = (await find).map((element) => element.patientId);

      return filterPatient.filter((element) => element !== null);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async fingPatientsByDate(data: Date) {
    try {
      const startDate = new Date(data);
      const endDate = new Date(data);
      endDate.setDate(startDate.getDate() + 1);

      const find = await this.mdeicalRecordSchema
        .find({
          createdAt: {
            $gte: startDate, // Greater than or equal to startDate
            $lt: endDate, // Less than endDate
          },
        })
        .populate('patientId');

      return find.map((element) => element.patientId);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  //The following code finds all the ambilatory patient with pagination(40 docs skip)
  async findAllAmbilatoryPatients(skip = 1, patientType = '') {
    if (!skip) {
      throw new UnauthorizedException('skip not provided');
    }
    try {
      const getpatients = await this.mdeicalRecordSchema
        .find(
          Boolean(patientType) && patientType !== '0'
            ? { patientType: patientType }
            : {},
        )
        .populate('patientId')
        .skip((Number(skip) - 1) * 40)
        .limit(40)
        .sort({ createdAt: -1 });

      return getpatients
        .filter((pateint) => pateint.patientId)
        .map((element) => element.patientId);
    } catch (error) {
      console.log(error.message);
    }
  }

  async countAllAmbulatoryCases(patientType = '') {
    try {
      const count = await this.mdeicalRecordSchema
        .find(
          Boolean(patientType) && patientType !== '0'
            ? { patientType: patientType }
            : {},
        )
        .countDocuments();

      return count;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async countAllAmbulatoryCasesByYear(patientType = ''): Promise<number> {
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);

    try {
      const patients = await this.mdeicalRecordSchema
        .find(
          Boolean(patientType) && patientType !== '0'
            ? {
                createdAt: { $gte: firstDayOfYear },
                patientType: patientType,
              }
            : {
                createdAt: { $gte: firstDayOfYear },
              },
        )
        .countDocuments()
        .exec();

      return patients;
    } catch (error) {
      console.log(error);
      throw new Error(`Unable to fetch patients: ${error.message}`);
    }
  }

  async countAllAmbulatoryCasesByMonth(patientType = ''): Promise<number> {
    try {
      const startOfMonth = new Date();
      startOfMonth.setDate(1); // Set date to the first day of the month
      startOfMonth.setHours(0, 0, 0, 0);

      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setMonth(endOfMonth.getMonth() + 1); // Move to the next month
      endOfMonth.setDate(0); // Set date to the last day of the previous month
      endOfMonth.setHours(23, 59, 59, 999);

      return this.mdeicalRecordSchema
        .find(
          Boolean(patientType) && patientType !== '0'
            ? {
                patientType: patientType,
                createdAt: {
                  $gte: startOfMonth,
                  $lte: endOfMonth,
                },
              }
            : {
                createdAt: {
                  $gte: startOfMonth,
                  $lte: endOfMonth,
                },
              },
        )
        .countDocuments()
        .exec();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async countAllAmbulatoryCasesByDay(patientType = ''): Promise<number> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return this.mdeicalRecordSchema
        .find(
          Boolean(patientType) && patientType !== '0'
            ? { createdAt: { $gte: today }, patientType: patientType }
            : { createdAt: { $gte: today } },
        )
        .countDocuments()
        .exec();
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }

  async getTodaysMedicalRecordsPayment(date: string) {
    try {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const find = await this.payementModal
        .find({
          payed: true,
          createdAt: {
            $gte: startDate, // Greater than or equal to startDate
            $lt: endDate, // Less than endDate
          },
        })
        .populate('patientId')
        .populate('senderId');

      const totalSolds = find.reduce((acc, currentElement) => {
        const totalPrice = currentElement.prescribeMedecin.reduce(
          (childacc, childCurrentEl) => {
            return (
              Number(childacc) +
              Number(childCurrentEl.id.price) * Number(childCurrentEl.quantity)
            );
          },
          0,
        );
        return acc + totalPrice;
      }, 0);

      return {
        solds: totalSolds,
        records: [
          ...find.map((item) => ({
            medicine: [
              ...item.prescribeMedecin.map((medicine) => ({
                ...medicine.id,
                quantity: medicine.quantity,
              })),
            ],
          })),
        ],
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getTodaysMedicalRecordsServicePayment(date: string) {
    try {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 0, 0);

      const find = await this.payementModal
        .find({
          createdAt: {
            $gte: startDate, // Greater than or equal to startDate
            $lt: endDate, // Less than endDate
          },
        })
        .populate('patientId')
        .populate('senderId');

      const totalSolds = find.reduce((acc, currentElement) => {
        const totalPrice = currentElement.Treatments.reduce(
          (childacc, childCurrentEl) => {
            return Number(childacc) + Number(childCurrentEl.price);
          },
          0,
        );
        return acc + totalPrice;
      }, 0);

      console.log({ find });

      return {
        solds: totalSolds,
        records: find,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
