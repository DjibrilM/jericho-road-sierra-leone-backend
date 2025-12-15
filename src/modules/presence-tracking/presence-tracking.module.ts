import { Module } from '@nestjs/common';
import { PresenceTrackingService } from './presence-tracking.service';
import { PresenceTrackingController } from './presence-tracking.controller';
import { PresenceModel, PresenceRecordSchema } from './presence.model';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../users/user.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: PresenceModel.name, schema: PresenceRecordSchema },
    ]),
  ],
  controllers: [PresenceTrackingController],
  providers: [PresenceTrackingService],
})
export class PresenceTrackingModule {}
