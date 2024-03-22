import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { validationExists } from "@utils/formValidators";
import { IFieldValidatorDetails, Question } from "@interfaces/appInterface";

export enum ELenFunctions {
  IsLength = "isLength",
  NumberIsRange = "numberIsRange",
  isValidCheckedItems = "isValidCheckedItems"
}

interface ILengthOptions {
  min?: number;
  max?: number;
}

enum ELengthOptionKeys {
  MIN = "min",
  MAX = "max"
}



interface IProps {
  handleFieldValidator: (details: IFieldValidatorDetails) => void;
  maxLabel?: string;
  minLabel?: string;
  selectedValidator: string;
  question: Question
}

const LengthValidator: React.FC<IProps> = ({ handleFieldValidator, maxLabel, minLabel, selectedValidator
  , question }) => {

  const currentValidationState = validationExists(question.validations, selectedValidator)

  let min = undefined;
  let max = undefined;
  if (currentValidationState) {
    const options = currentValidationState.validationOptions
    min = options["min"]
    max = options["max"]
  }
  const [validationOptions, setValidationOptions] = useState<ILengthOptions>({
    min: min ? min : '',
    max: max ? max : ''
  })


  const updateFields = (fieldName: ELengthOptionKeys, value: string) => {
    try {
      let number = parseFloat(value)
      if (!isNaN(number)) {
        setValidationOptions(prevOptions => {
          const updatedOptions: ILengthOptions = { ...prevOptions };

          // Use the enum value for key access
          switch (fieldName) {
            case ELengthOptionKeys.MAX:
            case ELengthOptionKeys.MIN:
              updatedOptions[fieldName] = number;
              break;
            default:
              break;
          }

          handleFieldValidator({
            keepValidation: true,
            validationFunctionName: selectedValidator,
            validationOptions: { min: updatedOptions.min, max: updatedOptions.max }
          });


          return updatedOptions;
        });
      }
    } catch (error) {
      // Handle the error
    }
  };


  return (<div className="flex flex-col w-full">
    {minLabel && (
      <div className="flex items-center space-x-2 my-3">
        <Label htmlFor="label">{minLabel}</Label>
        <Input type="text" id="minLabel"
          className="w-[180px]"
          inputMode="numeric"
          value={validationOptions.min}
          pattern="[0-9]*"
          onBlur={(e) => updateFields(ELengthOptionKeys.MIN, e.target.value)}
          placeholder="Enter value" onChange={(e) => updateFields(ELengthOptionKeys.MIN, e.target.value)} />
      </div>

    )}

    {maxLabel && (
      <div className="flex items-center space-x-2 my-3">
        <Label htmlFor="label">{maxLabel}</Label>
        <Input type="text" id="maxLabel"
          value={validationOptions.max}
          className="w-[180px]"
          inputMode="numeric"
          pattern="[0-9]*"
          onBlur={(e) => updateFields(ELengthOptionKeys.MAX, e.target.value)}
          placeholder="Enter value" onChange={(e) => updateFields(ELengthOptionKeys.MAX, e.target.value)} />
      </div>
    )}


  </div>
  );
};

export default LengthValidator;