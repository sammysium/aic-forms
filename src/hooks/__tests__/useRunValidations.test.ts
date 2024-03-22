import { renderHook } from "@testing-library/react"
import { useRunValidations } from "@hooks/useRunValidations"
import { IFieldValidatorDetails } from "@interfaces/appInterface"

describe('useRunValidations', () => {
    test('return validation error message', () => {
        const validations: IFieldValidatorDetails[] = [
            {
                validationFunctionName: "isEmpty",
                validationOptions: {},
                keepValidation: true
            }
        ]
        const { result } = renderHook(() => useRunValidations("", validations ))
        expect(result.current.validationMessage).toStrictEqual("Is Required")
    })

    test('return no error message on non-existent validator', () => {
        const validations: IFieldValidatorDetails[] = [
            {
                validationFunctionName: "nonExistingValida",
                validationOptions: {},
                keepValidation: true
            }
        ]
        const { result } = renderHook(() => useRunValidations("", validations ))
        expect(result.current.validationMessage).toStrictEqual("")
    })

    test('return no validation error message', () => {
        const validations: IFieldValidatorDetails[] = [
            {
                validationFunctionName: "isEmpty",
                validationOptions: {},
                keepValidation: true
            }
        ]
        const { result } = renderHook(() => useRunValidations("data", validations ))
        expect(result.current.validationMessage).toStrictEqual("")
    })
})