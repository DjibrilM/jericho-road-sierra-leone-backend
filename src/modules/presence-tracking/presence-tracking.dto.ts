import { IsNotEmpty,IsArray } from 'class-validator';
import { User } from '../users/user.model';
import { Document, Schema } from 'mongoose';

export class UpdateUserShiftDto {
  @IsNotEmpty()
  agent: string;

  @IsNotEmpty()
  shift: 'morning' | 'evening';
}


export class MarkPresenceDto {
  @IsNotEmpty()
  date: string;

  @IsNotEmpty()
  agent: string;
}

export class UpdateUsersShift {
  @IsNotEmpty()
  target: string;

  @IsArray()
  users: Document<User>[];
}