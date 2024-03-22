import { useState , useCallback} from 'react';
import { IFieldValidatorDetails } from '../interfaces/appInterface';

/*
  sets validations for a field.
*/

const useFieldValidator = (initialValidations: IFieldValidatorDetails[] = []) => {
  const [validations, setValidations] = useState(initialValidations);

  /*
  const handleFieldValidator = useCallback((details: IFieldValidatorDetails) => {
    const { validationFunctionName } = details;

    const isFunctionExists = validations.findIndex(
      (validation) => validation.validationFunctionName === validationFunctionName
    );

    if (!details.keepValidation) {
      setValidations((prevValidations) =>
        prevValidations.filter((validation) => validation !== details)
      );
    } else if (isFunctionExists !== -1) {
      const updatedValidations = [...validations];
      updatedValidations.splice(isFunctionExists, 1, details);
      setValidations(updatedValidations);
    } else {
      setValidations((prevValidations) => [...prevValidations, details]);
    }
  }, [validations]);
  */

  const handleFieldValidator = useCallback((details: IFieldValidatorDetails) => {
    const { validationFunctionName } = details;
  
    // Enhanced validation existence check:
    const isFunctionExists = validations.findIndex(
      (validation) =>
        validation.validationFunctionName === validationFunctionName
    );
  
    if (!details.keepValidation) {
      setValidations((prevValidations) =>
        prevValidations.filter((validation) => validation !== details)
      );
    } else if (isFunctionExists !== -1) {
      // Use array spread syntax for immutable updates:
      setValidations((prevValidations) => [
        ...prevValidations.slice(0, isFunctionExists),
        details,
        ...prevValidations.slice(isFunctionExists + 1),
      ]);
    } else {
      // Use array spread syntax for immutable updates:
      setValidations((prevValidations) => [...prevValidations, details]);
    }
  }, [validations]);

  return {
    validations,
    handleFieldValidator,
  };
};



export default useFieldValidator;
