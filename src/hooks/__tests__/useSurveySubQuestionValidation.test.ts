import { renderHook } from "@testing-library/react"
import { useSurveySubQuestionValidation } from "@hooks/useSurveySubQuestionValidation"


describe('useSurveySubQuestionValidation', () => {
    test('validate enough number of questions', () => {
        const { result } = renderHook(() => useSurveySubQuestionValidation([]))
        expect(result.current.errorMessage).toStrictEqual('You must provide at least 2 sub questions.')
        expect(result.current.isValid).toStrictEqual(false)
    })

    test('return isValid true', () => {
        const { result } = renderHook(() => useSurveySubQuestionValidation(["questionOne", "questionTwo"]))
        expect(result.current.errorMessage).toStrictEqual('')
        expect(result.current.isValid).toStrictEqual(true)
    })

    test('validate unique questions', () => {
        const { result } = renderHook(() => useSurveySubQuestionValidation(["q1", "q1"]))
        expect(result.current.errorMessage).toStrictEqual('Question repeated')
        expect(result.current.isValid).toStrictEqual(false)
    })

})