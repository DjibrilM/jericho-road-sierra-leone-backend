import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TriageAdultService } from './triage-adults.service';
import { CreateTriageAdultDto } from './triage-adults.dto';
import { AuthRequestPayload } from 'src/util/types';
import { AuthGuard } from 'src/middlewares/auth.guard';

@Controller('triage-adults')
@UseGuards(AuthGuard)
export class TriageAdultController {
  constructor(private readonly triageAdultService: TriageAdultService) {}

  /** Create a new triage record */
  @Post()
  create(
    @Body() createDto: CreateTriageAdultDto,
    @Req() request: AuthRequestPayload,
  ) {
    console.log(request.user);
    createDto.author = request.user.id ?? '';
    return this.triageAdultService.create(createDto);
  }

  /** Get all triage records */
  @Get()
  findAll() {
    return this.triageAdultService.findAll();
  }

  /** Get a single triage record by ID */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.triageAdultService.findOne(id);
  }

  /** Update a triage record by ID */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateTriageAdultDto>,
  ) {
    return this.triageAdultService.update(id, updateData);
  }

  /** Delete a triage record by ID */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.triageAdultService.remove(id);
  }

  /** Get all triage records for a specific author/user */
  @Get('author/:authorId')
  findByAuthor(@Param('authorId') authorId: string) {
    return this.triageAdultService.findByAuthor(authorId);
  }

  /** Get all triage records for a specific patient */
  @Get('patient/:patientId')
  findByPatient(@Param('patientId') patientId: string) {
    return this.triageAdultService.findByPatient(patientId);
  }

  /** Find records by filter query (e.g., reason, temperature, etc.) */
  @Get('search')
  findByData(@Query() query: Partial<CreateTriageAdultDto>) {
    return this.triageAdultService.findByData(query);
  }
}
