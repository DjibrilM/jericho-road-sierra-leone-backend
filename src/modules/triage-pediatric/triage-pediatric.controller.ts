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
import { TriagePediatricService } from './triage-pediatric.service';
import { CreateTriagePediatricDto } from './triage-pediatric.dto';
import { AuthRequestPayload } from 'src/util/types';
import { AuthGuard } from 'src/middlewares/auth.guard';

@Controller('triage-pediatric')
@UseGuards(AuthGuard)
export class TriagePediatricController {
  constructor(
    private readonly triagePediatricService: TriagePediatricService,
  ) {}

  /** Create a new triage record */
  @Post()
  create(
    @Body() createDto: CreateTriagePediatricDto,
    @Req() request: AuthRequestPayload,
  ) {
    console.log(request.user);
    createDto.author = request.user.id ?? '';
    return this.triagePediatricService.create(createDto);
  }

  /** Get all triage records */
  @Get()
  findAll() {
    return this.triagePediatricService.findAll();
  }

  /** Get a single triage record by ID */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.triagePediatricService.findOne(id);
  }

  /** Update a triage record by ID */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateTriagePediatricDto>,
  ) {
    return this.triagePediatricService.update(id, updateData);
  }

  /** Delete a triage record by ID */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.triagePediatricService.remove(id);
  }

  /** Get all triage records for a specific author/user */
  @Get('author/:authorId')
  findByAuthor(@Param('authorId') authorId: string) {
    return this.triagePediatricService.findByAuthor(authorId);
  }

  /** Get all triage records for a specific patient */
  @Get('patient/:patientId')
  findByPatient(@Param('patientId') patientId: string) {
    return this.triagePediatricService.findByPatient(patientId);
  }

  /** Find records by filter query (e.g., reason, temperature, etc.) */
  @Get('search')
  findByData(@Query() query: Partial<CreateTriagePediatricDto>) {
    return this.triagePediatricService.findByData(query);
  }
}
