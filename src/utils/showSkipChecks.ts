import { IAnswer } from "@contexts/reducers/formConsumerReducer"
import { EOperator, EUIType, IShowSkipLogicCondition, Section } from "@interfaces/appInterface"
import { findContentById } from "./search";
import React from "react";


export const shouldSkipMe = (
    skipLogicFormula:  IShowSkipLogicCondition[], 
    answers: IAnswer[], 
    content: Section[],
    isViewMode: boolean
    ) : boolean => {
    // return true to hide it. else false. 
    if (skipLogicFormula.length === 0 || !isViewMode) return false

    for (let counter = 0; counter < skipLogicFormula.length; counter++) {
        const formula = skipLogicFormula[counter];
        const questionId = formula.questionId
        const foundItem =  findContentById( content, questionId)
        if (foundItem.record &&
            foundItem.record.euiType === EUIType.Question
        ) {
            const answer = answers.find((answer) => answer.questionId === questionId)
            if (answer) {
                const userAnswer = answer.userInput.trim();
                if (userAnswer.length === 0) return true
                if (formula.operator === EOperator.ON) {
                    if (userAnswer.toLowerCase() === formula.firstValue.toLowerCase()) return true
                }
                const userInput = parseFloat(userAnswer)
                const firstValue = parseFloat(formula.firstValue)
                if (formula.operator === EOperator.BEFORE) {
                    if (userInput < firstValue) return true
                } else if (formula.operator === EOperator.BEFOREORON) {
                    if (userInput <= firstValue) return true
                } else if (formula.operator === EOperator.BEFOREORON) {
                    if (userInput <= firstValue) return true
                } else if (formula.operator === EOperator.AFTER) {
                    if (userInput > firstValue) return true
                } else if (formula.operator === EOperator.AFTERORON) {
                    if (userInput >= firstValue) return true
                } else if (formula.operator === EOperator.BETWEEN && formula.secondValue) {
                    const secondValue = parseFloat(formula.secondValue)
                    if (userInput >= firstValue && userInput <= secondValue) return true
                }
            } else {
                // not yet nswered so assume skipped.
                return true
            }

        }

    }
    // dont skip me
    return false
}

export const shouldRenderXTimes = (  
    answers: IAnswer[], 
    content: Section[],
    isViewMode: boolean,
    elementToRender: JSX.Element,
    uniqueId: string,
    formula?: IShowSkipLogicCondition

    ): JSX.Element[] => {
    if (!formula || !isViewMode) return [React.cloneElement(elementToRender as React.ReactElement<any>, { key: uniqueId })];

    const { questionId, operator, firstValue, secondValue, showOnceOnly } = formula;
    const foundItem = findContentById(content, questionId);

    if (foundItem.record?.euiType !== EUIType.Question) return [];

    const answer = answers.find((a) => a.questionId === questionId);
  

    if (!answer) return [];

    const uis : JSX.Element[] = []
    let total = 0;

    function showHowManyTimes(value: string) {
        if (showOnceOnly === true) return 1;
        const showTimes = parseInt(value, 10)
        if (isNaN(showTimes)) return 1
        
        return showTimes

    }

    const userInput = answer.userInput;
    const userInputNumber = parseFloat(userInput)
    const first = parseFloat(firstValue);
    const second = parseFloat(secondValue ? secondValue : "0");

    switch (operator) {
        case EOperator.ON:
            total =  userInput.toLowerCase() === firstValue.toLowerCase() ? showHowManyTimes(userInput) : 0;
            break;
        case EOperator.CONTAINS:
            total = userInput.toLowerCase().split(",").includes(firstValue.toLowerCase()) ? showHowManyTimes(userInput) : 0;
            break;
        case EOperator.BEFORE:
            total =  userInputNumber < first && userInputNumber > 0 ? showHowManyTimes(userInput) : 0;
            break;
        case EOperator.BEFOREORON:
            total = userInputNumber <= first && userInputNumber > 0 ? showHowManyTimes(userInput) : 0;
            break;
        case EOperator.AFTER:
            total =  userInputNumber > first && userInputNumber > 0 ? showHowManyTimes(userInput) : 0;
            break;
        case EOperator.AFTERORON:
            total = userInputNumber >= first && userInputNumber > 0 ? showHowManyTimes(userInput) : 0;
            break;
        case EOperator.BETWEEN:
            total =  secondValue && userInputNumber >= first && userInputNumber <= second && userInputNumber > 0 ? showHowManyTimes(userInput) : 0;
            break;
        default:
            total = 0;
    }
    for (let c = 0; c < total; c++){
        const key = `${uniqueId}_${c}`
        uis.push(React.cloneElement(elementToRender as React.ReactElement<any>, { key }));
       
    }
    return uis;
};