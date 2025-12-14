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

import { MaternityRecordsService } from '../services/maternity-records.service';
import CreateMaternityRecordDto from '../dto/create-maternity-record.dto';
import { AuthRequestPayload } from '../../hospitalization/hospitalization.controller';
import createPartogrammeRecordDto from '../dto/create-partogramme-record.dto';
import { AuthGuard } from 'src/middlewares/auth.guard';



@Controller('maternity-records')
export class MaternityRecordsController {
  constructor(
    private readonly maternityRecordsService: MaternityRecordsService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('create-record')
  create(
    @Body() createMaternityRecordDto: CreateMaternityRecordDto,
    @Req() @Req() request: AuthRequestPayload,
  ) {
    return this.maternityRecordsService.create(
      createMaternityRecordDto,
      request.user.id,
    );
  }

  @Get('user/all/:userId')
  findUserAll(@Param('userId') id: string) {
    return this.maternityRecordsService.findUserAll(id);
  }


  @UseGuards(AuthGuard)
  @Post('user/create/partogrammeRecord')
  async createPartogrammeRecord(
    @Body() body: createPartogrammeRecordDto,
    @Req() req: AuthRequestPayload,
  ) {
    return await this.maternityRecordsService.createPartogrammeRecord(
      req,
      body,
    );
  }

  @Get('user/getPartogrammeRecord/:id')
  async getgetPartogrammeRecord(@Param('id') id: string) {
    return await this.maternityRecordsService.getPartogrammeRecordById(id);
  }

  @Get('user/getPatientPartogrammeRecords/:materinityRecord/:patient')
  async getPatientPartogrammeRecords(
    @Param('materinityRecord') materinityRecordString: string,
    @Param('patient') patientId: string,
  ) {
    return await this.maternityRecordsService.getPatientPartogrammeRecords({
      patient: patientId,
      materinityRecord: materinityRecordString,
    });
  }

  @Get('user/getAllPartogrammeRecords/:patientId')
  async getAllPatientPartogrammeRecords(@Param('id') patientId: string) {
    return await this.maternityRecordsService.getAllPatientPartogrammeRecords(
      patientId,
    );
  }

  @Delete('user/deletePartogrammeRecords/:id')
  async deletePartogrammeRecords(@Param('id') id: string) {
    return await this.maternityRecordsService.deletePartogrammeRecords(id);
  }


  @UseGuards(AuthGuard)
  @Delete("delete-record")
  deleteMaternityRecord() {
    
  }
}
