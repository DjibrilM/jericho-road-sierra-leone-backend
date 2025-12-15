import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { AuthRequestPayload } from '../../hospitalization/hospitalization.controller';
import createActivePhaseSurveillanceRecordDto from '../dto/ create-active-phase-surveillance.dto';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { ActivePhaseSurveillanceService } from '../services/active-phase-surveillance.service';

@Controller('maternity-records')
export class ActivePhaseSurveillanceController {
  constructor(
    private readonly activePhaseSurveillanceService: ActivePhaseSurveillanceService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('user/create/ActivePhaseSurveillanceRecord')
  async createActivePhaseSurveillanceRecord(
    @Body() body: createActivePhaseSurveillanceRecordDto,
    @Req() req: AuthRequestPayload,
  ) {
    return await this.activePhaseSurveillanceService.createActivePhaseSurveillanceServiceRecord(
      req,
      body,
    );
  }

  @Get('user/getActivePhaseSurveillanceRecord/:id')
  async getgetActivePhaseSurveillanceRecord(@Param('id') id: string) {
    return await this.activePhaseSurveillanceService.getActivePhaseSurveillanceServiceRecordById(id);
  }

  @Get('user/getPatientActivePhaseSurveillanceRecords/:materinityRecord/:patient')
  async getPatientActivePhaseSurveillanceRecords(
    @Param('materinityRecord') materinityRecordString: string,
    @Param('patient') patientId: string,
  ) {
    return await this.activePhaseSurveillanceService.getPatientActivePhaseSurveillanceServiceRecords({
      patient: patientId,
      materinityRecord: materinityRecordString,
    });
  }

  @Get('user/getAllActivePhaseSurveillanceRecords/:patientId')
  async getAllPatientActivePhaseSurveillanceRecords(@Param('id') patientId: string) {
    return await this.activePhaseSurveillanceService.getAllPatientActivePhaseSurveillanceServiceRecords(
      patientId,
    );
  }

  @Delete('user/deleteActivePhaseSurveillanceRecords/:id')
  async deleteActivePhaseSurveillanceRecords(@Param('id') id: string) {
    return await this.activePhaseSurveillanceService.deleteActivePhaseSurveillanceServiceRecords(id);
  }

  @UseGuards(AuthGuard)
  @Delete('delete-record')
  deleteMaternityRecord() {}
}
