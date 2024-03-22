import { EUIType, IFilterQuestion, IFindRecords, Question, QuestionType, Section } from "@interfaces/appInterface";
import { findContentById, getFilteredQuestions } from "@utils/search";

// Mock data for testing
const data: Section[] = [
  {
    id: 'section1',
    euiType: EUIType.Section,
    label: 'section label',
    description: '',
    skipLogic: [],
    showLogic: undefined,
    content: [
      {
        id: 'subsection1',
        euiType: EUIType.SubSection,
        label: 'subsection',
        description: '',
        skipLogic: [],
        showLogic: undefined,
        questions: []
      },
      {
        id: 'question1',
        euiType: EUIType.Question,
        type: QuestionType.Phone,
        label: 'question',
        choices: [],
        subQuestions: [],
        multipleTimes: "1",
        isCalculated: false,
        validations: [],
        skipLogic: [],
        prefix: '',
        suffix: '',
        options: {},
      },
      {
        id: 'question3',
        euiType: EUIType.Question,
        type: QuestionType.Phone,
        label: 'question',
        choices: [],
        subQuestions: [],
        multipleTimes: "1",
        isCalculated: false,
        validations: [],
        skipLogic: [],
        prefix: '',
        suffix: '',
        options: {},
      },
      {
        id: 'subsection2',
        euiType: EUIType.SubSection,
        label: 'subsection',
        description: '',
        skipLogic: [],
        showLogic: undefined,
        questions: [
          {
            id: 'question2',
            euiType: EUIType.Question,
            type: QuestionType.Email,
            label: 'question',
            choices: [],
            subQuestions: [],
            multipleTimes: "1",
            isCalculated: false,
            validations: [],
            skipLogic: [],
            prefix: '',
            suffix: '',
            options: {}
          }
        ]
      },
    ]
  }
];

describe('findContentById', () => {
  test('finds section by id', () => {
    const result: IFindRecords = findContentById(data, 'section1');
    expect(result.sectionIndex).toBe(0);
    expect(result.subSectionIndex).toBe(-1);
    expect(result.questionIndex).toBe(-1);
    expect(result.record).toEqual(data[0]);
  });

  test('finds subsection by id', () => {
    const result: IFindRecords = findContentById(data, 'subsection2');
    expect(result.sectionIndex).toBe(0);
    expect(result.subSectionIndex).toBe(3);
    expect(result.questionIndex).toBe(-1);
    expect(result.record).toEqual(data[0].content[3]);
  });

  test('finds question by id', () => {
    const result: IFindRecords = findContentById(data, 'question1');
    expect(result.sectionIndex).toBe(0);
    expect(result.subSectionIndex).toBe(-1);
    expect(result.questionIndex).toBe(1);
    expect(result.record).toEqual(data[0].content[1]);
  });

  test('returns correct values for non-existing id', () => {
    const result: IFindRecords = findContentById(data, 'nonexistentId');
    expect(result.sectionIndex).toBe(-1);
    expect(result.subSectionIndex).toBe(-1);
    expect(result.questionIndex).toBe(-1);
    expect(result.record).toBeUndefined();
  });
});

describe('getFilteredQuestions', () => {
  test('filters questions by type and draft status', () => {
    const filter: IFilterQuestion = {
      types: [QuestionType.Phone],
      excludeIds: []
    };
    const result: Question[] = getFilteredQuestions(data, filter);
    expect(result).toHaveLength(2);
    expect(result[0].type).toBe(QuestionType.Phone);
  });

  test('handles empty filter', () => {
    const filter: IFilterQuestion = {
      types: [],
      excludeIds: []
    };
    const result: Question[] = getFilteredQuestions(data, filter);
    expect(result).toHaveLength(3); // All questions should be included
  });

  test('excludes questions by id', () => {
    const filter: IFilterQuestion = {
      types: [QuestionType.Phone],
      excludeIds: ['question1']
    };
    const result: Question[] = getFilteredQuestions(data, filter);
    expect(result).toHaveLength(1);
  });
});
