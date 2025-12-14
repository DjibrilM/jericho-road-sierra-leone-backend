import { IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateRadiographieDto {
    @IsNotEmpty()
    doctor:mongoose.Schema.Types.ObjectId;

    @IsNotEmpty()
    patient:mongoose.Schema.Types.ObjectId

    @IsNotEmpty()
    result:string;

    @IsNotEmpty()
    diagnosis:string;

    @IsNotEmpty()
    description:string

    @IsNotEmpty()
    files: string[]

}
