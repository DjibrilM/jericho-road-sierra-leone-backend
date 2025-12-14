import { IsNotEmpty } from 'class-validator';

export class CreateServiceDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  price: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  type: string;
}

export class UpdateServiceDto {
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  price: string;

  @IsNotEmpty()
  type: 'laboratory' | 'others' | 'radiographie';
}
