import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { PresenceTrackingService } from './presence-tracking.service';
import {
  MarkPresenceDto,
  UpdateUserShiftDto,
  UpdateUsersShift,
} from './presence-tracking.dto';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { AdminCheck } from 'src/middlewares/admin.guard';

@UseGuards(AuthGuard)
@Controller('presence-tracking')
export class PresenceTrackingController {
  constructor(
    private readonly presenceTrackingService: PresenceTrackingService,
  ) {}

  @Get('get-morning-presence')
  async agentGetmorningPresence() {
    return await this.presenceTrackingService.getDayPresence();
  }

  @Get('get-evening-presence')
  async agentGetEveningPresence() {
    return await this.presenceTrackingService.getEveningPresence();
  }

  @Get('get-presence-by-month/:id')
  async getAgentPresencesByDay(
    @Param('id') id: string,
    @Query('date') date: string,
  ) {
    return await this.presenceTrackingService.getAgentPresenceByDate(id, date);
  }

  @Get('get-presences')
  async getPresences(@Query('filter') filter: 'morning' | 'evening') {
    return await this.presenceTrackingService.getAgentPresences(filter);
  }

  @Get('agent-prences')
  async getAgentPresences(
    @Query('agent') agent: string,
    @Query('skip') skip: number,
  ) {
    return await this.presenceTrackingService.getAgentPresence(skip, agent);
  }

  @Get('count-agent-presences/:id')
  async countAgentPresences(@Param('id') id: string) {
    return await this.presenceTrackingService.counAgentPresences(id);
  }

  @Post('mark-presence')
  async markPresence(@Body() body: MarkPresenceDto) {
    return await this.presenceTrackingService.markPresence(body);
  }

  @UseGuards(AdminCheck)
  @Post('updates-users-presence')
  async updatesUsersPresences(@Body() body: UpdateUsersShift) {
    return await this.presenceTrackingService.updateUsersShift(body);
  }

  @UseGuards(AdminCheck)
  @Post('update-user')
  async updatUserShift(@Body() data: UpdateUserShiftDto) {
    return await this.presenceTrackingService.updateUserShift(data);
  }
}
