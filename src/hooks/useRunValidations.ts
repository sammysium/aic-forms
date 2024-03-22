import { IFieldValidatorDetails } from "@interfaces/appInterface";
import { useCallback, useEffect, useState } from "react";
import { inputValidators } from "@utils/inputValidators";


export const useRunValidations = (input: string, validations?: IFieldValidatorDetails[]) => {

    const [validationMessage, setValidationMessage] = useState('')

    const totalValidations = validations ? validations.length : 0;

    const runValidations = useCallback(() => {
        if (!validations) {
            setValidationMessage('')
        } else {
            for (let counter = 0; counter < totalValidations; counter++) {

                const validation = validations[counter];
                const validationFunctionName = validation.validationFunctionName
                if (inputValidators[validationFunctionName]) {
                    const invalidIfEqualTo = inputValidators[validationFunctionName].invalidIfResultEqualsTo
                    const result = inputValidators[validationFunctionName].functionName(input, validation.validationOptions)
                    if (result === invalidIfEqualTo) {
                        setValidationMessage(inputValidators[validationFunctionName].message);
                        return;
                    }

                }


            }
        }
        setValidationMessage("")
    }, [input, validations, totalValidations])

    useEffect(() => {

        runValidations();

    }, [runValidations])

    return { validationMessage }


}