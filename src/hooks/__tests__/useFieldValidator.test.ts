import { act, renderHook } from "@testing-library/react";
import useFieldValidator from "../useFieldValidator";
import { IFieldValidatorDetails } from "@interfaces/appInterface";

describe('useFieldValidator', () => {

    test('returns empty validations', () => {
    
        const { result } = renderHook(()=>useFieldValidator())
        expect(result.current.validations).toStrictEqual([])
    })

    test('returns correct validations', () => {

        const initialValidations: IFieldValidatorDetails[] = [
            {
                validationFunctionName: "isEmpty",
                validationOptions: {},
                keepValidation: true
            }
        ]
    
        const { result } = renderHook(()=>useFieldValidator())
       

        act(()=>{
            result.current.handleFieldValidator(
                {
                    validationFunctionName: "isEmpty",
                    validationOptions: {},
                    keepValidation: true
                }
            )

        })
        expect(result.current.validations).toHaveLength(1)
        act(() => {
            result.current.handleFieldValidator({
              validationFunctionName: "isLength",
              validationOptions: { min: 5 },
              keepValidation: true,
            });
          });
        
          expect(result.current.validations).toHaveLength(2);
    })


})