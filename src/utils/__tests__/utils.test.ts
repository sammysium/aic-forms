import { IChoice, IFieldValidatorDetails } from "@interfaces/appInterface"
import { compareDates, convertDataToType, createUniqueNameFromTitle, markRequiredField, removeNonAlphanumeric, stringIsNumber, validateChoices } from "@utils/utils"

describe('utils', () => {
    test('createUniqueNameFromTitle', () => {

        expect(createUniqueNameFromTitle("hello world")).toStrictEqual("hello_world")
        expect(createUniqueNameFromTitle("hellO World")).toStrictEqual("hello_world")
        expect(createUniqueNameFromTitle("hello-world")).toStrictEqual("hello-world")

    })

    test('stringIsNumber', () => {
        expect(stringIsNumber("123")).toStrictEqual(true)
        expect(stringIsNumber("123W")).toStrictEqual(false)
    })

    test('removeNonAlphanumeric', () => {
        expect(removeNonAlphanumeric("hello world")).toEqual("helloworld")
        expect(removeNonAlphanumeric("helloworld")).toEqual("helloworld")
        expect(removeNonAlphanumeric("hello.world")).toEqual("helloworld")

    })

    test('compareDates', () => {

        expect(compareDates("2012-01-15", "2012-01-01")).toStrictEqual(true)
        expect(compareDates("2012-01-01", "2012-01-01")).toStrictEqual(false)
        expect(compareDates("2011-01-15", "2012-01-01")).toStrictEqual(false)
        expect(compareDates("2011-01-abc", "2012-01-01")).toStrictEqual(false)

    })

    test('markRequiredField', () => {

        const validations: IFieldValidatorDetails[] = [
            {
                validationFunctionName: "isEmpty",
                keepValidation: true,
                validationOptions: {}
            }
        ]

        expect(markRequiredField(validations)).toStrictEqual("*")

        const validations2: IFieldValidatorDetails[] = [
            {
                validationFunctionName: "isLength",
                keepValidation: true,
                validationOptions: { "max": 10 }
            },
            {
                validationFunctionName: "textIsOnlyLetters",
                keepValidation: true,
                validationOptions: {}
            }
        ]

        expect(markRequiredField(validations2)).toStrictEqual("")


    })

    test('validateChoices', () => {
        const choiceOption: IChoice[] = [
            {
                label: "",
                value: ""
            }
        ]

        const choiceOptionTwo: IChoice[] = [
            {
                label: "label1",
                value: ""
            },
            {
                label: "label1",
                value: ""
            }
        ]

        const choiceOptionThree: IChoice[] = [
            {
                label: "label1",
                value: ""
            },
            {
                label: "label2",
                value: ""
            }
        ]

        expect(validateChoices(choiceOption)).toStrictEqual(false)
        expect(validateChoices(choiceOptionTwo)).toStrictEqual(false)
        expect(validateChoices(choiceOptionThree)).toStrictEqual(true)


    })

    test('convertDataToType', () => {
        expect(convertDataToType.stringToBoolean("")).toStrictEqual(false)
        expect(convertDataToType.stringToBoolean("false")).toStrictEqual(false)
        expect(convertDataToType.stringToBoolean("data")).toStrictEqual(true)
        expect(convertDataToType.stringToBoolean(" ")).toStrictEqual(false)
    })
})