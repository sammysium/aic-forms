import React, {useState } from 'react';
import isDate from 'validator/lib/isDate';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from '@/components/ui/label';
import { EOperator, IFieldValidatorDetails, Question } from "@interfaces/appInterface";
import { compareDates } from "@utils/utils";
import { Input } from '@/components/ui/input';

export enum ELenFunctions {
    IsLength = "isLength",
    NumberIsRange = "numberIsRange"

}

interface IDateOptions {
    min?: string;
    max?: string;
}

enum ELengthOptionKeys {
    MIN = "min",
    MAX = "max",
}

export enum EDateTimeValidationOption {
    Date = "date",
    Time = "time",
    DateTime = "dateTime"
}

interface IProps {
    handleFieldValidator: (details: IFieldValidatorDetails) => void;
    maxLabel?: string;
    minLabel?: string;
    question: Question
}

const DateTimeValidator: React.FC<IProps> = ({ handleFieldValidator, question }) => {

 
    const validations = question.validations;
    
    const [validationFormatOption, setValidationFormatOption] = useState("")
    const [inputType, setInputType] = useState("datetime-local")
    const [operator, setOperator] = useState<EOperator>(EOperator.ON)
    const [validationOptions, setValidationOptions] = useState<IDateOptions>({
        min: undefined,
        max: undefined
    });

    const updateFields = (fieldName: ELengthOptionKeys, value: string) => {
        try {

            setValidationOptions(prevOptions => {
                const updatedOptions: IDateOptions = { ...prevOptions };

                switch (fieldName) {
                    case ELengthOptionKeys.MAX:
                    case ELengthOptionKeys.MIN:
                        updatedOptions[fieldName] = value;
                        break;
                    default:
                        break;
                }



                return updatedOptions;
            });

        } catch (error) {
            // Handle the error
        }
    };



    const handleValidationOption = (option: string) => {
        setValidationFormatOption(option);
        setInputType(option === "number" ? "number" : "datetime-local")
    }

    const handleSaveValidation = () => {
        // validate it all now
        if (validationFormatOption === "number") {
            let firstValue = -1
            let secondValue = -1
            if (operator !== EOperator.BETWEEN && validationOptions.min) {
                firstValue = parseInt(validationOptions.min, 10)
            } else if (operator === EOperator.BETWEEN && validationOptions.min && validationOptions.max) {
                firstValue = parseInt(validationOptions.min, 10)
                secondValue = parseInt(validationOptions.max, 10);
                if (secondValue < firstValue) {
                    alert('Second value must be greater than first value')
                    return false;
                }
            }

        } else {
            if (operator !== EOperator.BETWEEN && validationOptions.min) {
                if (!isDate(validationOptions.min)) {
                    alert("Date is not valid")
                    return false;
                }
            } else if (operator === EOperator.BETWEEN && validationOptions.min && validationOptions.max) {
                if (!isDate(validationOptions.min) || !isDate(validationOptions.max)) {
                    alert("Date is not valid");
                    return false;
                }
                if (!compareDates(validationOptions.max, validationOptions.min)) {
                    alert('Second value must be greater than first value')
                    return false;
                }
            }
        }
        handleFieldValidator({
            keepValidation: true,
            validationFunctionName: "validateDate",
            validationOptions: { min: validationOptions.min, max: validationOptions.max, operator, validationFormatOption }
        });
    }


    return (<div className="flex flex-col w-full">
        
        <div className="flex items-center space-x-2 my-3">
            <Label htmlFor="label">Validate By Option</Label>
            <Select onValueChange={(e) => handleValidationOption(e)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select text validation option" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="date">Validate By Date</SelectItem>
                        <SelectItem value="time">Validate By Time</SelectItem>
                        <SelectItem value="datetime">Validate By DateTime</SelectItem>
                        <SelectItem value="number">Validate By Numbers</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>

        <div className="flex items-center space-x-2 my-3">
            <Label htmlFor="label">Comparison Option</Label>
            <Select onValueChange={(e) => setOperator(e as EOperator)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select text validation option" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value={EOperator.ON}>On</SelectItem>
                        <SelectItem value={EOperator.BEFORE}>Before</SelectItem>
                        <SelectItem value={EOperator.BEFOREORON}>Before or On</SelectItem>
                        <SelectItem value={EOperator.AFTER}>After</SelectItem>
                        <SelectItem value={EOperator.AFTERORON}>After or On</SelectItem>
                        <SelectItem value={EOperator.BETWEEN}>Between</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>

        <div className="flex items-center space-x-2 my-3">
            <div className="grid w-full max-w-sm items-center gap-1.5 my-2">
                <Label htmlFor="label">Value</Label>
                <Input
                onChange={(e)=>updateFields(ELengthOptionKeys.MIN, e.target.value)} />

            

            </div>

            {operator === EOperator.BETWEEN && (
                <div className="grid w-full max-w-sm items-center gap-1.5 my-2">
                    <Label htmlFor="secondValue">Second Value</Label>
                    <Input
                onChange={(e)=>updateFields(ELengthOptionKeys.MAX, e.target.value)} />
                </div>
            )}


        </div>





        <button onClick={handleSaveValidation}>Confirm Validations</button>

    </div>
    );
};

export default DateTimeValidator;