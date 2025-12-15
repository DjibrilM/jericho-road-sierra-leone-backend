import {
  Get,
  Controller,
  Body,
  UseGuards,
  Post,
  Query,
  Req,
  Param,
} from '@nestjs/common';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { CaseRecordsListDto, CreateCaseDto } from './cases.dto';
import { CasesService } from '../cases/cases.service';
import { AuthRequestPayload } from '../hospitalization/hospitalization.controller';

@Controller('cases')
@UseGuards(AuthGuard)
export class CasesController {
  constructor(private readonly caseServices: CasesService) {}

  @Post('create/case')
  async createCase(@Body() CreateCaseDto: CreateCaseDto) {
    return this.caseServices.createCases(CreateCaseDto);
  }

  @Get('get/all/case')
  async getAllCase() {
    return await this.caseServices.findAllCases();
  }

  @Post('create/case-record')
  async createCaseRecord(
    @Body() body: CaseRecordsListDto,
    @Req() request: AuthRequestPayload,
  ) {
    return await this.caseServices.createCaseRecord(body, request.user.id);
  }

  @Get('count/year/cases/:case')
  async countYearlyCaseRecords(@Param('case') caseId: string) {
    return await this.caseServices.countYearlyCaseRecords(caseId);
  }

  @Get('count/monthl/cases/:case')
  async countMonthlyCaseRecords(@Param('case') caseId: string) {
    return await this.caseServices.countMonthlyCaseRecords(caseId);
  }

  @Get('count/day/cases/:case')
  async countDailyCaseRecords(@Param('case') caseId: string) {
    return await this.caseServices.countTodayCaseRecords(caseId);
  }

  @Get('count/cases/by/id/:case')
  async countCaseRecordsById(@Param('case') caseId: string) {
    return await this.caseServices.getCountCasesByCaseId(caseId);
  }

  @Get('get/record/cases/:case')
  async getCaseRecordsById(
    @Param('case') caseId: string,
    @Query('skip') skip: number,
  ) {
    return await this.caseServices.getRecordCasesByCaseId(skip, caseId);
  }

  @Get('get/cases/by/month/:case')
  async getCaseRecordsByMonth(
    @Param('case') caseId: string,
    @Query('date') date: Date,
  ) {
    return await this.caseServices.getRecordCasesByMonth(date, caseId);
  }

  @Get('get/cases/by/date/:case')
  async getCaseRecordsByDate(
    @Param('case') caseId: string,
    @Query('date') date: Date,
  ) {
    return await this.caseServices.getRecordCasesByDate(date, caseId);
  }
}
