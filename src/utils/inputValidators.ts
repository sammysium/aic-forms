/* eslint-disable @typescript-eslint/no-unused-vars */
import isEmpty from "validator/lib/isEmpty"
import isEmail from "validator/lib/isEmail";
import isLength from "validator/lib/isLength"
import isURL from "validator/lib/isURL";

export function textIsOnlyLetters(input: string, _options: object): boolean {
    const re = /^[A-Za-z\b]*$/;
    return re.test(input)
}

export function textValidatorAllowAlphaNumerics(input: string, _options: object): boolean{
    const re = /^[A-Za-z0-9\b]*$/;
    return re.test(input)
}

export function textValidatorAllowLettersHyphnesSpaces(input: string, _options: object): boolean{
    const re = /^[A-Za-z \b-]*$/;
    return re.test(input)
}

function isMoney(input: string, _options: object): boolean {
    const re = /^\d+(?:\.\d{0,4})$/;
    return re.test(input) 
}

export function isValidCheckedItems(input: string, options: any) : boolean {
    const min = options["min"]
    const max = options["max"]

    if (!min && !max) return true

    const value = input.trim()
    if (value === "") return false;
    const separator  = options["separator"] ? options["separator"] : ","
    const items = value.split(separator)
    const len = items.length
   
    try {
        if (min && !max && len >= min) return true
        if (!min && max && len <= max) return true
        if (min && max && len >=min && len <=max ) return true
        return false
    } catch (error) {
        return false;
    }

}

interface IInputValidator  {
    [key:string]: {
        functionName: Function,
        message: string,
        invalidIfResultEqualsTo: boolean
    }
  }
  

export const inputValidators: IInputValidator = {
    isEmpty: {
        functionName: isEmpty,
        message: "Is Required",
        invalidIfResultEqualsTo: true
    },
    isEmail: {
        functionName: isEmail,
        message: "Must be a valid email format",
        invalidIfResultEqualsTo: false
    },
    isLength: {
        functionName: isLength,
        message: "Must be valid length",
        invalidIfResultEqualsTo: false
    },
    numberIsRange: {
        functionName: isLength,
        message: "Must be valid length",
        invalidIfResultEqualsTo: false
    },
    isURL: {
        functionName: isURL,
        message: "Must be a valid URL",
        invalidIfResultEqualsTo: false
    },
    textIsOnlyLetters: {
        functionName: textIsOnlyLetters,
        message: "Must be only letters",
        invalidIfResultEqualsTo: false
    },
    textValidatorAllowAlphaNumerics: {
        functionName: textValidatorAllowAlphaNumerics,
        message: "Must be only letters and numbers",
        invalidIfResultEqualsTo: false
    },
    textValidatorAllowLettersHyphnesSpaces: {
        functionName: textValidatorAllowLettersHyphnesSpaces,
        message: "Must be only letters and numbers",
        invalidIfResultEqualsTo: false
    },
    isValidCheckedItems: {
        functionName: isValidCheckedItems,
        message: "Invalid selection",
        invalidIfResultEqualsTo: false
    },
    isMoney: {
        functionName: isMoney,
        message: "Invalid money",
        invalidIfResultEqualsTo: false
    }
}