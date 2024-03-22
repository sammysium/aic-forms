import { IFieldValidatorDetails } from "../interfaces/appInterface";
import validator from "validator";

export const numberIsRange = (value: string, min: number, max: number) : boolean => {
    if (!validator.isNumeric(value)) {
        return false;
      }
const numValue = parseFloat(value);
  return numValue >= min && numValue <= max;
}

export const validationExists = (validations: IFieldValidatorDetails[] , validatorName : string) : IFieldValidatorDetails | undefined => {
  return validations.find(v => v.validationFunctionName === validatorName)
}

