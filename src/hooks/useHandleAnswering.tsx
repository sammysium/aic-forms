import { Question, Section } from "@interfaces/appInterface";
import { useState, useEffect, useContext, useCallback } from 'react';
import { useRunValidations } from './useRunValidations';
import { uiFromValidations } from "@utils/utils";
import { inputValidators } from "@utils/inputValidators";
import { AnswerContext, IAnswerAppContext } from "@contexts/AnswerContext";
import { evaluateFormula, findAnswerForQuestion } from "@utils/search";


const useHandleAnswering = (question: Question, questionnaireContent: Section[] = []) => {
    const { dispatch, answers } = useContext(AnswerContext) as IAnswerAppContext;

    const currentAnswer = findAnswerForQuestion(answers, question);

    const [userHasTyped, setUserHasTyped] = useState(false)
    const showHowManyTimes = parseInt(question.multipleTimes, 10);
    const defaultSingleAnswer = showHowManyTimes === 1 ? currentAnswer?.userInput ?? "" : ""
    const defaultMultiAnswer = showHowManyTimes > 1 ? currentAnswer?.userInput.split(",") ?? [] : []



    const [value, setValue] = useState(defaultSingleAnswer);
    const { validationMessage } = useRunValidations(value, question.validations)
    const controls = uiFromValidations(question.validations)
    const [multipleAnswers, setMultipleAnswers] = useState<string[]>(defaultMultiAnswer);

    const handleMultipleAnswers = () => {

        const v = value.trim();

        if (!multipleAnswers.some((item) => item.toLowerCase() === v.toLowerCase())) {
            setMultipleAnswers([...multipleAnswers, v]);
            setUserHasTyped(true)
            setValue('');
        }

    };

    const updateMultiAnswer = (indexToUpdate: number, v: string) => {

        const currentAnswers = [...multipleAnswers];
        currentAnswers[indexToUpdate] = v;
        setUserHasTyped(true)
        setMultipleAnswers(currentAnswers);

    };

    const removeMultiAnswer = (indexToRemove: number) => {
        setUserHasTyped(true)
        setMultipleAnswers((prevD) => {
            const updatedD = [...prevD.slice(0, indexToRemove), ...prevD.slice(indexToRemove + 1)];
            return updatedD;
        });
    };

    useEffect(() => {
        
            dispatch({
                type: 'HANDLE_ERROR',
                payload: {
                    id: question.id,
                    errorMessage: validationMessage
                }
            });
        
    }, [dispatch, question.id, validationMessage]);

    useEffect(() => {
        if (validationMessage.length === 0) {
            if (userHasTyped) {

                const answer = showHowManyTimes === 1 ? value : multipleAnswers.join(',');

                dispatch({
                    type: 'ADD_ANSWER',
                    payload: {
                        questionId: question.id,
                        userInput: answer,
                    },
                });
                setUserHasTyped(false)
            } else if (question.isCalculated) {
                const result = evaluateFormula(questionnaireContent, answers, question.formulaForCalculatedFieldType?.refs).toString();
                dispatch({
                    type: 'ADD_ANSWER',
                    payload: {
                        questionId: question.id,
                        userInput: result,
                    },
                });
                setValue(result)
            }

        }

        // dispatch({
        //     type: 'HANDLE_ERROR',
        //     payload: {
        //         id: question.id,
        //         errorMessage: validationMessage
        //     }
        // })
      

    }, [value, validationMessage, questionnaireContent, answers, dispatch, question, multipleAnswers, showHowManyTimes, userHasTyped, currentAnswer]);

    const handleChange = (v: string) => {


        if (controls.textValidationName === undefined || v === '') {
            setValue(v);
            setUserHasTyped(true)
        } else if (
            controls.textValidationName !== undefined &&
            inputValidators[controls.textValidationName] !== undefined
        ) {
            const textValidator = inputValidators[controls.textValidationName];
            if (textValidator.functionName(v, {})) {
                setValue(v);
                setUserHasTyped(true)
            }
        }

    };

    return {
        value,
        setValue,
        validationMessage,
        showHowManyTimes,
        handleMultipleAnswers,
        updateMultiAnswer,
        removeMultiAnswer,
        handleChange,
        multipleAnswers,
        setMultipleAnswers
    };
};

export default useHandleAnswering;
