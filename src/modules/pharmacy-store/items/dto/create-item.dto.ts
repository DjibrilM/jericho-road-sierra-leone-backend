import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateItemDto {
  @IsString() @IsNotEmpty() name: string;
  @IsString() @IsNotEmpty() category: string;
  @IsNumber() quantity: number;
  @IsString() @IsNotEmpty() type: string;
  @IsString() @IsNotEmpty() expiry: string;
}
