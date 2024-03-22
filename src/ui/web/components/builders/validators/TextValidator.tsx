import React from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from '@/components/ui/label';
import { IFieldValidatorDetails, Question } from "@interfaces/appInterface";



interface IProps {
  handleFieldValidator: (details: IFieldValidatorDetails) => void;
  question: Question
}

export const textValidations = {
  "textIsOnlyLetters": "Allow Only Letters",
  "textValidatorAllowAlphaNumerics":"Allow AlphaNumerics",
  "textValidatorAllowLettersHyphnesSpaces":"Allow Letters, Hyphens and Spaces"
}

export const textValidationFunctionNames = Object.keys(textValidations)



const TextValidator: React.FC<IProps> = ({ handleFieldValidator, question }) => {

  const validations = question.validations;
  let defaultValue = ""

  const textValidationKeys = Object.keys(textValidations)
  

  for(let validation of validations) {
    if (textValidationKeys.indexOf(validation.validationFunctionName) > -1) {
      defaultValue = validation.validationFunctionName
    }
  }

 
  const handleSelection = (option: string) => {
    if (option === "selectOption") return;
 
  handleFieldValidator({
    keepValidation: true,
    validationFunctionName: option,
    validationOptions: {}
  })
  }


  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center space-x-2 my-3">
        <Label htmlFor="label">Text Validation</Label>
        <Select onValueChange={(e) => handleSelection(e)}
        defaultValue={defaultValue}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select text validation option" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem  value="selectOption">Select Option</SelectItem>

            {textValidationKeys.map(key=> {
              const label = (textValidations as any)[key]

              return( <SelectItem key={key}  value={key}>{label}</SelectItem>)
            })}

            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>


  );
};

export default TextValidator;