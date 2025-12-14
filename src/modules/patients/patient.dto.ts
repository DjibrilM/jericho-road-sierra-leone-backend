import { IsNotEmpty } from 'class-validator';

export class CreatePatientDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  secondName: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  birthdate: Date;

  @IsNotEmpty()
  ProfilePicture: string;

  @IsNotEmpty()
  emergencyContact: string;

  @IsNotEmpty()
  gender: string;

  @IsNotEmpty()
  address: string;
}

export class SearchByName {
  @IsNotEmpty()
  name: string;
}
