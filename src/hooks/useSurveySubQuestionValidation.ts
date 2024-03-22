import { useEffect, useState } from "react"
import isEmpty from "validator/lib/isEmpty"


export const useSurveySubQuestionValidation = (questions: string[]) => {
    const [isValid, setIsValid] = useState(true)
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const validteQuestions = () => {
            if (questions.length < 2) {
                setIsValid(false)
                setErrorMessage('You must provide at least 2 sub questions.');
                return;
            }
            const labelSet = new Set();
            let question = "";
            for(const q of questions){
                question = q.trim().toLowerCase();
                if (isEmpty(question)) {
                    setIsValid(false);
                    setErrorMessage('Empty question found')
                    return;
                }
                if (labelSet.has(question)) {
                    setIsValid(false);
                    setErrorMessage('Question repeated')
                    return;
                }
    
                labelSet.add(question)
    
            }
            setIsValid(true)
            setErrorMessage('')
        }
   
        validteQuestions();

    }, [questions])

    return { isValid, errorMessage };
}