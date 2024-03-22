import {renderHook} from '@testing-library/react'

import { useChoicesValidation } from '../useChoicesValidation'; // replace with the correct file path
import { IChoice } from "@interfaces/appInterface";

describe('useChoicesValidation', () => {
  test('returns valid state when choices are valid', () => {
    const choices: IChoice[] = [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' },
    ];

    const { result } = renderHook(() => useChoicesValidation(choices));

    expect(result.current.isValid).toBe(true);
    expect(result.current.errorMessage).toBe('');
  });

  test('returns invalid state with proper error message for empty choices', () => {
    const choices: IChoice[] = [];

    const { result } = renderHook(() => useChoicesValidation(choices));

    expect(result.current.isValid).toBe(false);
    expect(result.current.errorMessage).toBe('You must provide at least two choices');
  });

  test('returns invalid state with proper error message for duplicate labels', () => {
    const choices: IChoice[] = [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 1', value: 'option3' },
      ];
    const { result } = renderHook(() => useChoicesValidation(choices));

    expect(result.current.isValid).toBe(false);
    expect(result.current.errorMessage).toBe('The choices are invalid. Make sure all labels are unique.');
  });

  test('returns invalid state with proper error message for empty label', () => {
    const choices: IChoice[] = [
      { label: 'Option 1', value: 'one' },
      { label: '', value: '' },
      { label: 'Option 3', value: 'three' },
    ];

    const { result } = renderHook(() => useChoicesValidation(choices));

    expect(result.current.isValid).toBe(false);
    expect(result.current.errorMessage).toBe('The choices are invalid. Make sure all labels are given and unique.');
  });
});
