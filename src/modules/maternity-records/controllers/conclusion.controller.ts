import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { CreateConclusionRecordDto } from '../dto/create-conclusion-record.dto';
import { AuthRequestPayload } from 'src/util/types';
import { ConclusionRecordService } from '../services/maternity-conclusion.service';

@Controller('maternity-records')
export class ConclusionRecordController {
  constructor(
    private readonly conclusionRecordService: ConclusionRecordService,
  ) {}

  /** ---------------- CREATE ---------------- */
  @UseGuards(AuthGuard)
  @Post('user/create/conclusionRecord')
  async createConclusionRecord(
    @Body() body: CreateConclusionRecordDto,
    @Req() request: AuthRequestPayload,
  ) {
    return await this.conclusionRecordService.create(request, body);
  }

  /** ---------------- GET BY ID ---------------- */
  @Get('user/getConclusionRecord/:id')
  async getConclusionRecord(@Param('id') id: string) {
    return await this.conclusionRecordService.findOne(id);
  }

  /** ---------------- GET LATEST FOR PATIENT ---------------- */
  @Get('user/getLatestConclusionRecord/:patientId')
  async getLatestConclusionRecord(@Param('patientId') patientId: string) {
    return await this.conclusionRecordService.findLatestByPatient(patientId);
  }

  /** ---------------- GET ALL FOR ONE PATIENT ---------------- */
  @Get('user/getAllConclusionRecords/:patientId')
  async getAllPatientConclusionRecords(@Param('patientId') patientId: string) {
    return await this.conclusionRecordService.findAllByPatient(patientId);
  }

  /** ---------------- DELETE ---------------- */
  @UseGuards(AuthGuard)
  @Delete('user/deleteConclusionRecord/:id')
  async deleteConclusionRecord(@Param('id') id: string) {
    return await this.conclusionRecordService.remove(id);
  }
}
