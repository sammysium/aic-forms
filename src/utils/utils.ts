import { EOperator, IChoice, IFieldValidatorDetails, IFormControlAttributes } from "@interfaces/appInterface"
import { textValidationFunctionNames } from "@ui/components/builders/validators/TextValidator";
import { v4 as uuidv4 } from 'uuid';

export const convertDataToType = {
    stringToBoolean: (value: string): boolean => {
        if (value.trim() === "") return false
        if (value.trim().toLowerCase() === "false") return false
        return true
    }
}

export const createUniqueNameFromTitle =  (label: string) => {
    return label.toLowerCase().replace(/ /g, '_');
}

export const stringIsNumber = (value: string): boolean  => {
    const re = /^[0-9\b]+$/;
    if  (re.test(value) ) return true
    return false
}

export function removeNonAlphanumeric(input: string): string {
    return input.replace(/[^a-zA-Z0-9]/g, '');
  }

export function compareDates(date1: string, date2: string): boolean {
    // return true if date1>date 2. false in all other instances
    try {
        const dt1: Date = new Date(date1); // Replace with your date
        const dt2: Date = new Date(date2); // Replace with your date
        
        if (dt1 > dt2) {
            return true
        }
        return false;
    } catch (error) {
        return false;
    }

}

export function markRequiredField(validations: IFieldValidatorDetails[]) : string {
    for(let validation of validations) {
        if (validation.validationFunctionName === "isEmpty") return "*"
    }
    return "";
}

export function validateChoices(choices: IChoice[]) : boolean {
    const labelSet = new Set<string>();

    for (const choice of choices) {
        // Check if label is not empty
        if (choice.label.trim() === "") {
            return false;
        }

        // Check if label is unique
        if (labelSet.has(choice.label)) {
            return false;
        }

        labelSet.add(choice.label);
    }

    return true;
}
  

export const generateId = () : string => {
    return uuidv4()
}

export const uiFromValidations = (validations: IFieldValidatorDetails[]) : IFormControlAttributes=> {
    /*
        given validations, see if we can control the UI. Note the validations still run
        through validation. So if user has stated maxLength to be 100 then,
        still validation runs but we also add maxLength validation to the control
    */
   const options : IFormControlAttributes = {
    max: undefined,
    min: undefined,
    textValidationName: undefined
   }
   validations.forEach(v=>{
    const validationOptions = v.validationOptions
    if (v.validationFunctionName === "numberIsRange") {
        if (validationOptions["min"] !==undefined) {
            options.min = validationOptions["min"]
        }

        if (validationOptions["max"] !==undefined) {
            options.max = validationOptions["max"]
        }
    } else if (textValidationFunctionNames.indexOf(v.validationFunctionName) > -1) {
        options.textValidationName = v.validationFunctionName
    }
    
   })

   return options;
}


export const isValidEOperator = (value: any): value is EOperator => {
    return Object.values(EOperator).includes(value);
  };