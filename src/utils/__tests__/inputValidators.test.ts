import { inputValidators, isValidCheckedItems, textIsOnlyLetters, textValidatorAllowAlphaNumerics, textValidatorAllowLettersHyphnesSpaces } from "@utils/inputValidators"

describe('inputValidators', () => {
    test('textIsOnlyLetters', () => {
        expect(textIsOnlyLetters("hello", {})).toStrictEqual(true)
        expect(textIsOnlyLetters("hell1o", {})).toStrictEqual(false)
        expect(textIsOnlyLetters("hello world", {})).toStrictEqual(false)
        expect(textIsOnlyLetters("hello.world", {})).toStrictEqual(false)

    })

    test('textValidatorAllowAlphaNumerics', () => {
        expect(textValidatorAllowAlphaNumerics("hello", {})).toStrictEqual(true)
        expect(textValidatorAllowAlphaNumerics("123", {})).toStrictEqual(true)
        expect(textValidatorAllowAlphaNumerics("hello123", {})).toStrictEqual(true)
        expect(textValidatorAllowAlphaNumerics("hello.123", {})).toStrictEqual(false)
        expect(textValidatorAllowAlphaNumerics("hello 123", {})).toStrictEqual(false)
        expect(textValidatorAllowAlphaNumerics("hello_123", {})).toStrictEqual(false)
        expect(textValidatorAllowAlphaNumerics("hello-123", {})).toStrictEqual(false)
    })

    test('textValidatorAllowLettersHyphnesSpaces', () => {
        expect(textValidatorAllowLettersHyphnesSpaces("", {})).toStrictEqual(true)
        expect(textValidatorAllowLettersHyphnesSpaces("hello world", {})).toStrictEqual(true)
        expect(textValidatorAllowLettersHyphnesSpaces("hello-world", {})).toStrictEqual(true)
        expect(textValidatorAllowLettersHyphnesSpaces("hello- world", {})).toStrictEqual(true)
        expect(textValidatorAllowLettersHyphnesSpaces("hello-12-world", {})).toStrictEqual(false)
        expect(textValidatorAllowLettersHyphnesSpaces("hello-12 world", {})).toStrictEqual(false)
    })

    
})

describe('isValidCheckedItems', () => {
    // Valid cases
    test('valid input with default separator', () => {
      const input = 'item1,item2,item3';
      const options = {};
      expect(isValidCheckedItems(input, options)).toBe(true);
    });
  
    test('valid input with custom separator', () => {
      const input = 'item1|item2|item3';
      const options = { separator: '|' };
      expect(isValidCheckedItems(input, options)).toBe(true);
    });
  
    // Min and Max cases
    test('valid input with min only', () => {
      const input = 'item1,item2,item3';
      const options = { min: 2 };
      expect(isValidCheckedItems(input, options)).toBe(true);
    });
  
    test('valid input with max only', () => {
      const input = 'item1,item2,item3';
      const options = { max: 4 };
      expect(isValidCheckedItems(input, options)).toBe(true);
    });
  
    test('valid input with both min and max', () => {
      const input = 'item1,item2,item3';
      const options = { min: 2, max: 4 };
      expect(isValidCheckedItems(input, options)).toBe(true);
    });
  
    // Invalid cases
    test('invalid input with min only', () => {
      const input = 'item1';
      const options = { min: 2 };
      expect(isValidCheckedItems(input, options)).toBe(false);
    });
  
    test('invalid input with max only', () => {
      const input = 'item1,item2,item3';
      const options = { max: 2 };
      expect(isValidCheckedItems(input, options)).toBe(false);
    });
  
    test('invalid input with both min and max', () => {
      const input = 'item1,item2,item3';
      const options = { min: 4, max: 6 };
      expect(isValidCheckedItems(input, options)).toBe(false);
    });
  
    // Edge cases
    test('empty input with no constraints', () => {
      const input = '';
      const options = {};
      expect(isValidCheckedItems(input, options)).toBe(true);
    });
  
    test('empty input with min and max constraints', () => {
      const input = '';
      const options = { min: 1, max: 3 };
      expect(isValidCheckedItems(input, options)).toBe(false);
    });

  });

  describe('validate inputs', () => {
    test('isEmpty', () => {
        expect(inputValidators["isEmpty"].functionName("")).toStrictEqual(true)
        expect(inputValidators["isEmpty"].functionName(" ")).toStrictEqual(false)
    })

    test('isURL', () => {
        expect(inputValidators["isURL"].functionName("")).toStrictEqual(false)
        expect(inputValidators["isURL"].functionName("https://www.aicollect.io")).toStrictEqual(true)
    })

    test('isEmail', () => {
        expect(inputValidators["isEmail"].functionName("")).toStrictEqual(false)
        expect(inputValidators["isEmail"].functionName("https://www.aicollect.io")).toStrictEqual(false)
        expect(inputValidators["isEmail"].functionName("hello@")).toStrictEqual(false)
        expect(inputValidators["isEmail"].functionName("hello@team")).toStrictEqual(false)
        expect(inputValidators["isEmail"].functionName("kmsium@gmail.com")).toStrictEqual(true)
   
    })

    test('isLength', () => {
        expect(inputValidators["isLength"].functionName("hello", {})).toStrictEqual(true)
        expect(inputValidators["isLength"].functionName("hello", {min: 3})).toStrictEqual(true)
        expect(inputValidators["isLength"].functionName("he", {min: 3})).toStrictEqual(false)
        expect(inputValidators["isLength"].functionName("hello", {min: 3, max: 5})).toStrictEqual(true)
        expect(inputValidators["isLength"].functionName("hello", {min: 3, max: 4})).toStrictEqual(false)
        expect(inputValidators["isLength"].functionName("hell", {max: 5})).toStrictEqual(true)
        expect(inputValidators["isLength"].functionName("helloooo", {max: 6})).toStrictEqual(false)





    })

  })