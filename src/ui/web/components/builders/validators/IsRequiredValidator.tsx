import React, { useState } from 'react';


import { validationExists } from "@utils/formValidators";
import { IFieldValidatorDetails, Question } from "@interfaces/appInterface";

interface IIsRequredOptions {
  is_required: boolean;
}

enum EIsRequiredOptionKeys {
  IS_REQUIRED = "is_required"
}

interface IProps {
  handleFieldValidator: (details: IFieldValidatorDetails) => void;
  question: Question
}

const IsRequiredValidator: React.FC<IProps> = ({ handleFieldValidator, question }) => {

  const currentValidationState = validationExists (question.validations, "isEmpty")
  


  const [validationOptions, setValidationOptions] = useState<IIsRequredOptions>({
    is_required: currentValidationState !== undefined ? true : false
  })

  const updateFields = (fieldName: EIsRequiredOptionKeys, value: boolean) => {
    setValidationOptions(prevOptions => {
      const updatedOptions: IIsRequredOptions = { ...prevOptions };

      // Use the enum value for key access
      switch (fieldName) {
        case EIsRequiredOptionKeys.IS_REQUIRED:
          updatedOptions[fieldName] = value
          break;
        default:
          break;
      }
      handleFieldValidator({
        keepValidation: value,
        validationFunctionName: "isEmpty",
        validationOptions: {}
      })

      return updatedOptions;
    });
  };

  return (<div className="flex items-center space-x-2 my-3">
    <label

      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      Is Required
    </label>

    <input id="isRequired" type="checkbox"
      checked={validationOptions.is_required}
      value="false"
      className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
      onChange={(e) => updateFields(EIsRequiredOptionKeys.IS_REQUIRED, e.target.checked)}
    />



  </div>
  );
};

export default IsRequiredValidator;
