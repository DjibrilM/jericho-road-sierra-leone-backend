import mongoose, { Model } from 'mongoose';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/user.model';
import { PresenceModel } from './presence.model';
import { CronJob } from 'cron';
import {
  MarkPresenceDto,
  UpdateUserShiftDto,
  UpdateUsersShift,
} from './presence-tracking.dto';

@Injectable()
export class PresenceTrackingService {
  constructor(
    @InjectModel(User.name) private userSchema: Model<User>,
    @InjectModel(PresenceModel.name)
    private presenceSchema: Model<PresenceModel>,
  ) {}
  private cronJob: CronJob;
  private cronJobEvening: CronJob;
  private cronJobEveningExit: CronJob;

  onModuleInit() {
    console.log('Presence monitoring initialized✅');
    this.cronJob = new CronJob(
      '0 5 * * *', // Runs at 6:00 AM every day
      () => {
        this.createMorningEntrency();
      },
      null,
      false,
      'Africa/Lubumbashi', // Timezone for Goma, DRC (CAT)
    );

    // Cron job to run every day at 16:30 Goma time (CAT)
    this.cronJobEvening = new CronJob(
      '30 16 * * *', // 16:30 (4:30 PM) daily
      () => {
        this.createMorningExit();
        this.createEveningPresence();
      },
      null,
      false,
      'Africa/Lubumbashi', // Timezone for Goma, DRC (CAT)
    );

    // Cron job to run every day at 16:30 Goma time (CAT)
    this.cronJobEveningExit = new CronJob(
      '30 10 * * *', // 16:30 (4:30 PM) daily
      () => {
        this.createEveningExit();
      },
      null,
      false,
      'Africa/Lubumbashi', // Timezone for Goma, DRC (CAT)
    );

    // Start the cron job
    this.cronJob.start();
    this.cronJobEvening.start();
    this.cronJobEveningExit.start();
  }

  async createMorningEntrency() {
    console.log('Morning presence created ✅');
    const agents = await this.userSchema.find({ shift: 'morning' });
    agents.forEach(async (agent) => {
      const constructId = new mongoose.Types.ObjectId(agent._id);
      await this.presenceSchema.create({
        agent: constructId,
        shift: 'morning',
      });
    });
  }

  async createEveningPresence() {
    console.log('Evening presence created ✅');
    const agents = await this.userSchema.find({ shift: 'evening' });
    agents.forEach((agent) => {
      const constructId = new mongoose.Types.ObjectId(agent._id);
      this.presenceSchema.create({ agent: constructId, shift: 'evening' });
    });
  }

  async createMorningExit() {
    console.log('Morning presence exit created ✅');
    const agents = await this.userSchema.find({ shift: 'morning' });
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset to the start of the day (midnight);

    agents.forEach(async (agent) => {
      const constructId = new mongoose.Types.ObjectId(agent._id);
      const presence = await this.presenceSchema.findOne({
        agent: agent._id,
        createdAt: { $gte: today },
      });

      if (presence) {
        const enteredHours = new Date(presence.entered).getHours();
        const exitHours = new Date(presence.exited).getHours();

        if (!presence.entered || enteredHours > 9 || exitHours < 16) {
          await this.presenceSchema.findOneAndUpdate(
            { _id: presence._id },
            { verdict: 'absent' },
          );
        } else {
          await this.presenceSchema.findOneAndUpdate(
            { _id: presence._id },
            {
              verdict: 'present',
            },
          );
        }
      }
    });
  }

  async markPresence(data: MarkPresenceDto) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const presence = await this.presenceSchema.findOne({
        agent: data.agent,
        createdAt: { $gte: today },
      });

      if (!presence.entered) {
        await this.presenceSchema.findOneAndUpdate(
          { _id: presence._id },
          { entered: data.date },
        );
      } else if (presence.entered && !presence.exited) {
        await this.presenceSchema.findOneAndUpdate(
          { _id: presence._id },
          { exited: data.date },
        );
      }

      return 'ok';
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async createEveningExit() {
    console.log('Evening presence exit created ✅');
    const agents = await this.userSchema.find({ shift: 'evening' });
    const endDate = new Date(); // Today's current date and time

    const startDate = new Date(); // Start with today's date
    startDate.setDate(startDate.getDate() - 1); // Go back one day to get yesterday
    startDate.setHours(16, 0, 0, 0); // Set the time to 4 PM yesterday

    agents.forEach(async (agent) => {
      const presence = await this.presenceSchema.findOne({
        shift: 'evening',
        agent: agent._id,
        createdAt: {
          $gte: startDate, // From 4 PM yesterday
          $lte: endDate, // To the current date and time today
        },
      });

      if (presence) {
        if (!presence.entered) {
          this.presenceSchema.findOneAndUpdate(
            { _id: presence._id },
            { verdict: 'absent' },
          );
        } else {
          this.presenceSchema.findOneAndUpdate(
            { _id: presence._id },
            { verdict: 'present' },
          );
        }
      }
    });
  }

  async getAgentPresence(skip: number, agent: string) {
    const presence = await this.presenceSchema
      .find({
        agent: agent,
      })
      .skip((Number(skip) - 1) * 40)
      .limit(40)
      .sort({ createdAt: -1 })
      .populate('agent');

    return presence;
  }

  async getDayPresence() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const data = await this.presenceSchema
      .find({
        createdAt: { $gte: today },
        shift: 'morning',
      })
      .populate('agent');
    return data;
  }

  async getEveningPresence() {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    today.setHours(0, 0, 0, 0);
    return await this.presenceSchema
      .find({
        createdAt: { $gte: today },
        shift: 'morning',
      })
      .populate('agent');
  }

  async getAgentPresences(filter: 'morning' | 'evening') {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    today.setHours(0, 0, 0, 0);

    const data = await this.presenceSchema
      .find({
        createdAt: { $gte: today },
        shift: filter,
      })
      .populate('agent');

    return data;
  }

  async updateUserShift({ agent, shift }: UpdateUserShiftDto) {
    try {
      return await this.userSchema.findByIdAndUpdate(agent, { shift: shift });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to update shift');
    }
  }

  async getAgentPresenceByDate(agentId: string, date: string) {
    try {
      const agent = new mongoose.Types.ObjectId(agentId);
      const startOfMonth = new Date(date);
      startOfMonth.setDate(1); // Set date to the first day of the month
      startOfMonth.setHours(0, 0, 0, 0);

      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setMonth(endOfMonth.getMonth() + 1); // Move to the next month
      endOfMonth.setDate(0); // Set date to the last day of the previous month
      endOfMonth.setHours(0, 0, 0, 0);

      const data = await this.presenceSchema
        .find({
          agent: agent,
          createdAt: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        })
        .populate('agent');

      return data;
    } catch (error) {
      new InternalServerErrorException();
    }
  }

  async counAgentPresences(id: string) {
    return await this.userSchema.findById(id).countDocuments();
  }

  async updateUsersShift(data: UpdateUsersShift) {
    data.users.forEach(async (user) => {
      await this.userSchema.findByIdAndUpdate(user._id, { shift: data.target });
    });
    return 'update';
  }
}
