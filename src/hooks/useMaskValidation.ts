import { useCallback, useEffect, useState } from "react"
import isEmpty from "validator/lib/isEmpty"


export const useMaskValidation = (input: string, mask? : string) => {
    const [maskValidationMessage, setMaskValidationMessage] = useState('')

    const runValidations = useCallback(() => {
        if (!mask || isEmpty(mask)) {
            return true
        } else {
            // check if the typed value conforms to the required mask
            if (input.length !== mask.length) {
                return false
              }
             
              for (let i = 0; i < mask.length; i++) {
                const maskChar = mask[i];
                const inputChar = input[i];
             
                switch (maskChar) {
                  case "#":
                    if (!/\d/.test(inputChar)) { // Check if input character is a digit
                      return false;
                    }
                    break;
                  case "_":
                    if (!/[a-zA-Z]/.test(inputChar)) { // Check if input character is a letter
                      return false;
                    }
                    break;
                  default:
                    if (maskChar !== inputChar) { // Literal character mismatch
                      return false;
                    }
                }
              }
             
              return true; // All characters matched successfully
        }
        
    }, [input, mask])


    useEffect(() => {
        const result = runValidations()
    
        if (!result) {
            setMaskValidationMessage(`Expected format is ${mask}`)
        } else{
            setMaskValidationMessage('')
        }
        
    }, [runValidations, mask])

    return { maskValidationMessage }
   

    
}