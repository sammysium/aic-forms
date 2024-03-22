import { renderHook } from "@testing-library/react"
import { useMaskInput } from "@hooks/useMaskInput"


describe('useMaskInput', () => {
    test('returns masked string', () =>{
        const { result } = renderHook(() => useMaskInput("345", "###"))
        expect(result.current.formattedInput).toStrictEqual("345")
    })

    test('returns masked string - invalid length', () =>{
        const { result } = renderHook(() => useMaskInput("345", "####"))
        expect(result.current.formattedInput).toStrictEqual("345")
    })

    test('returns masked string - follow input', () =>{
        const { result } = renderHook(() => useMaskInput("ABCD", "####-4-"))
        expect(result.current.formattedInput).toStrictEqual("####-4-")
    })
})