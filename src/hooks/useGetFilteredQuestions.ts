import { IFilterQuestion, Question, QuestionType, Section } from "@interfaces/appInterface";
import { useEffect, useState } from "react";
import { getFilteredQuestions } from "@utils/search";

export const useGetFilteredQuestions = ((content: Section[], filter: IFilterQuestion) => {
    const [validQuestions, setValidQuestions] = useState<Question[]>([])


    useEffect(() => {
        const determiningQuestions = getFilteredQuestions(content, filter)
            setValidQuestions(determiningQuestions)
    }, [content, filter])

    return { validQuestions}

})