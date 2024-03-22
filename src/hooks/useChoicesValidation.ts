import { IChoice } from '../interfaces/appInterface';
import { useState, useEffect } from 'react';

export const useChoicesValidation = (choices: IChoice[]) => {
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const validateChoices = () => {
      if (choices.length <= 1) {
        setIsValid(false);
        setErrorMessage('You must provide at least two choices');
        return;
      }

      const labelSet = new Set();
      let label = ""

      for (const choice of choices) {
         label = choice.label.trim().toLowerCase()
        if (label === '') {
          setIsValid(false);
          setErrorMessage('The choices are invalid. Make sure all labels are given and unique.');
          return;
        }

        if (labelSet.has(label)) {
          setIsValid(false);
          setErrorMessage('The choices are invalid. Make sure all labels are unique.');
          return;
        }

        labelSet.add(label);
      }

      setIsValid(true);
      setErrorMessage('');
    };

    validateChoices();
  }, [choices]);

  return { isValid, errorMessage };
};
