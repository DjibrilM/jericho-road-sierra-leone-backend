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
import CreateExamenPhysiqueRecordDto from '../dto/create-examen-physique-record.dto';
import { MaternityPhysicalExaminationService } from '../services/maternityPhysicalExamination.service';
import { AuthRequestPayload } from 'src/util/types';

@Controller('maternity-records')
export class ExamenPhysiqueController {
  constructor(
    private readonly maternityPhysicalExaminationService: MaternityPhysicalExaminationService,
  ) {}

  /** ---------------- CREATE ---------------- */
  @UseGuards(AuthGuard)
  @Post('user/create/examenPhysiqueRecord')
  async createExamenPhysiqueRecord(
    @Body() body: CreateExamenPhysiqueRecordDto,
    @Req() @Req() request: AuthRequestPayload,
  ) {
    return await this.maternityPhysicalExaminationService.createExamenPhysiqueRecord(
      request,
      body,
    );
  }

  /** ---------------- GET BY ID ---------------- */
  @Get('user/getExamenPhysiqueRecord/:id')
  async getExamenPhysiqueRecord(@Param('id') id: string) {
    return await this.maternityPhysicalExaminationService.getExamenPhysiqueRecordById(
      id,
    );
  }

  /** ---------------- GET ALL FOR ONE PATIENT IN A MATERNITY RECORD ---------------- */
  @Get('user/getPatientExamenPhysiqueRecords/:maternityRecord/:patient')
  async getPatientExamenPhysiqueRecords(
    @Param('maternityRecord') maternityRecord: string,
    @Param('patient') patientId: string,
  ) {
    return await this.maternityPhysicalExaminationService.getPatientExamenPhysiqueRecords(
      patientId,
      maternityRecord,
    );
  }

  /** ---------------- GET ALL FOR ONE PATIENT ---------------- */
  @Get('user/getAllExamenPhysiqueRecords/:patientId')
  async getAllPatientExamenPhysiqueRecords(
    @Param('patientId') patientId: string,
  ) {
    return await this.maternityPhysicalExaminationService.getAllPatientExamenPhysiqueRecords(
      patientId,
    );
  }

  /** ---------------- DELETE ---------------- */
  @UseGuards(AuthGuard)
  @Delete('user/deleteExamenPhysiqueRecord/:id')
  async deleteExamenPhysiqueRecord(@Param('id') id: string) {
    return await this.maternityPhysicalExaminationService.deleteExamenPhysiqueRecord(
      id,
    );
  }
}
