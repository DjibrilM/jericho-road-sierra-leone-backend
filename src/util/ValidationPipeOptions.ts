import { ValidationOptions } from "class-validator";
import { ValidationError } from "@nestjs/common";

export interface ValidationPipeOptions extends ValidationOptions {
    transform?: boolean;
    disableErrorMessages?: boolean;
    exceptionFactory?: (errors: ValidationError[]) => any;
}