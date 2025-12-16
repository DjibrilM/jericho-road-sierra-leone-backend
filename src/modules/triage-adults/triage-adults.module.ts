import { Module } from '@nestjs/common';
import { TriageSchema, TriageAdult } from './triage-adults.model';
import { TriageAdultService } from './triage-adults.service';
import { TriageAdultController } from './triage-adults.controller';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TriageAdult.name,
        schema: TriageSchema,
      },
    ]),
  ],
  controllers: [TriageAdultController],
  providers: [TriageAdultService],
})
export class TriageAdultModule {}
