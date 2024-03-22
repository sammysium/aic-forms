import { useCallback, useEffect, useState } from "react"
import isEmpty from "validator/lib/isEmpty"


export const useMaskInput = (input: string, mask?: string) => {

    const [formattedInput, setFormattedInput ] = useState("")

    const runFormmater = useCallback(()=> {

        if (!mask || isEmpty(mask)) return input;
        let formattedValue = "";
        let inputIndex = 0;
    
        for (let i = 0; i < mask.length; i++) {
          const maskChar = mask[i];
          const inputChar = input[inputIndex];
    
          if (inputChar === undefined) {
            break;
          }
    
          if (maskChar === "#" && /\d/.test(inputChar)) {
            formattedValue += inputChar;
            inputIndex++;
          } else if (maskChar === "_" && /[a-zA-Z]/.test(inputChar)) {
            formattedValue += inputChar.toUpperCase();
            inputIndex++;
          } else if (maskChar === inputChar) {
            formattedValue += inputChar.toUpperCase();
            inputIndex++;
          } else {
            formattedValue += maskChar;
          }
    
          if (inputIndex >= input.length) {
            break;
          }
        }

        return formattedValue;

    }, [input, mask])

    useEffect(()=>{
        const result = runFormmater();
        setFormattedInput(result)
    }, [runFormmater])

    return { formattedInput }

}