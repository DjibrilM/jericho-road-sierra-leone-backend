import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  NotFoundException,
  UseGuards,
  Query,
  Put,
} from '@nestjs/common';
import { TriageService } from './triage.service';
import { CreateTriageDto, CreateAptitudePhysiquePayment } from './triage.dto';
import { Triage } from './triage.model';
import { AuthGuard } from 'src/middlewares/auth.guard';
import mongoose from 'mongoose';

@Controller('triages')
export class TriageController {
  constructor(private readonly triageService: TriageService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createTriage(
    @Body() createTriageDto: CreateTriageDto,
  ): Promise<Triage> {
    try {
      return await this.triageService.createTriage(createTriageDto);
    } catch (error) {
      throw new Error('Failed to create triage');
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getTriageById(@Param('id') triageId: string): Promise<Triage> {
    try {
      return await this.triageService.getTriageById(triageId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new Error('Failed to fetch triage by ID');
      }
    }
  }

  @UseGuards(AuthGuard)
  @Get('find/all/:clientId')
  async getAllTriage(
    @Param('clientId') clientId: mongoose.Schema.Types.ObjectId,
  ): Promise<Triage[]> {
    try {
      return await this.triageService.getAllTriage(clientId);
    } catch (error) {
      throw new Error('Failed to fetch all triages');
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteTriage(@Param('id') triageId: string): Promise<void> {
    try {
      await this.triageService.deleteTriage(triageId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new Error('Failed to delete triage');
      }
    }
  }

  @UseGuards(AuthGuard)
  @Get('find/aptitude-physique/invoices')
  async getAptitudePhysiqueInvoices(@Query('date') date: string) {
    try {
      return await this.triageService.getAptitudePhysiqueByDate(date);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new Error('Failed to delete triage');
      }
    }
  }

  @UseGuards(AuthGuard)
  @Get('find/aptitude-physique/payments/:date')
  async getAptitudePhysiquepayments(@Param('date') date: string) {
    try {
      return await this.triageService.getAptitudePhysiquePaymentByDate(date);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new Error('Failed to delete triage');
      }
    }
  }

  @UseGuards(AuthGuard)
  @Post('create/aptitude/physique/payment')
  createAptitudePhysiquePayment(@Body() { id }: CreateAptitudePhysiquePayment) {
    return this.triageService.createAptitudephysiquePayment(id);
  }
}
