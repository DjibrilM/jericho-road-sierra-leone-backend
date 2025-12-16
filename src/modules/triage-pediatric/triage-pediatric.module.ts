import { Module } from '@nestjs/common';
import { TriageSchema, TriagePediatric } from './triage-pediatric.model';
import { TriagePediatricService } from './triage-pediatric.service';
import { TriagePediatricController } from './triage-pediatric.controller';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TriagePediatric.name,
        schema: TriageSchema,
      },
    ]),
  ],
  controllers: [TriagePediatricController],
  providers: [TriagePediatricService],
})
export class TriagePediatricModule {}
