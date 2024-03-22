

import { IAnswer } from "@contexts/reducers/formConsumerReducer";
import { ElementType } from "react";

// the block types
export enum EUIType {
  Section = "section",
  SubSection = "subSection",
  Question = "question"
}

export enum EBasicQuestionFields {
  label = "label",
  tooltip = "tooltip",
  description = "description",
  placeholder = "placeholder",
  validations = "validations",
  choices = "choices",
  subQuestions = "subQuestions",
  formulaForCalculatedFieldType = "formulaForCalculatedFieldType",
  isCalculated = "isCalculated",
  mask = "mask",
  maskExample = "maskExample",
  prefix = "prefix",
  suffix = "suffix",
  multipleTimes = "multipleTimes",
  options = "options",
  skipLogic = "skipLogic",
  textContent = "textContent"
}

export interface IDateTimeOptions {
  showClock: boolean,
  minDate?: Date,
  startDate?: Date,
  endDate?: Date
}


export interface IChoice {
  label: string,
  value: string
}

export interface IQuestionInformation {
  label: string;
  tooltip: string;
  description: string;
  placeholder: string;
  validations?: IFieldValidatorDetails[]
  choices?: IChoice[]
}


export interface IFormControlAttributes  {
  min?: number;
  max?: number;
  textValidationName?: string

}

export interface IFieldValidatorDetails {
  keepValidation: boolean,
  validationFunctionName: string,
  validationOptions: any
}

export enum EOperator {
  BETWEEN = "between",
  ON = "on",
  BEFORE = "before",
  BEFOREORON = "beforeOrOn",
  AFTER = "after",
  AFTERORON = "afterOrOn",
  CONTAINS = "contains"
}

export enum QuestionType {
  Email = 'email',
  Text = 'text',
  TextArea = 'textArea',
  Number = 'number',
  Money = 'money',
  Radio = 'radio',
  CheckBox = 'checkbox',
  DropDown = 'dropDown',
  FileUpload = 'fileUpload',
  Location = 'location',
  Phone = 'phone',
  CapturePhoto = 'capturePhoto',
  Survey = "survey",
  // Calculated = "calculated",
  AreaMap = "areaMap",
  DateTime = "datetime",
  BarCode = "barcode",
  Audio = "audio",
  Video = "video",
  Signature = "signature",
  QRCode = "qrCode",
  TermsAndConditions = "termsAndConditions",
  URL = "url"
}


export interface IPropsFillFormMode {
  content: Section[],
  handleFormSubmission: (result: IAnswer[]) => void;
}

export interface IPropsFromBuilder {
  saveForm: (content: Section[], title: string, desc: string) => void
}

export type TQuestionOptions = {
  [key in QuestionType]?: Partial<{
    mask?: boolean;
    multiple?: boolean;
    sufPrefix?: boolean;
    placeHolder?: boolean;
    proximity?: boolean;
    calculatableField?: boolean;
    validations: {
      isRequired?: boolean;
      dateTime?: boolean;
      isEmail?: boolean;
      isURL?: boolean;
      numberIsRange?: boolean, // length of characters for e.g.
      isValidCheckedItems?: boolean,
      isCurrency?: boolean,
      isWholeNumber?: boolean,
      textValidation?: boolean
    },
    attachedLabels?: { // in build mode, what labels does it use for other UIs such as isLengthValidator
      max: string,
      min: string
    }
    // Add other specific options here for each QuestionType
  }>;
};

export const questionTypeOptions: TQuestionOptions = {
  [QuestionType.Email]: {
    validations: {
      isRequired: true,
      isEmail: true
    },
    placeHolder: true, mask: false, multiple: true, sufPrefix: false
  },
  [QuestionType.Text]: {
    attachedLabels: {
      max: 'Max Length',
      min: 'Min Length'
    },
    validations: {
      isRequired: true,
      numberIsRange: true,
      textValidation: true,
    }, placeHolder: true, mask: true, multiple: true, sufPrefix: true
  },
  [QuestionType.Number]: {
    attachedLabels: {
      max: 'Maximum',
      min: 'Minimum'
    },
    validations: {
      isRequired: true,
      numberIsRange: true,
      isWholeNumber: true,
    }, placeHolder: true, mask: true, multiple: true, sufPrefix: true,
    calculatableField: true
  },
  [QuestionType.Phone]: {
    validations: {
      isRequired: true,
    }, placeHolder: true, mask: true, multiple: true, sufPrefix: true
  },
  [QuestionType.TextArea]: {
    validations: {
      isRequired: true,
      numberIsRange: true,
      
    }, placeHolder: true
  },
  [QuestionType.Location]: {
    validations: {
      isRequired: true,
     
    }, placeHolder: false,
    proximity: true
  },
  [QuestionType.AreaMap]: {
    validations: {
      isRequired: true,
    }, placeHolder: false
  },
  [QuestionType.DateTime]: {
    validations: {
      isRequired: true,
      dateTime: true,
    }, placeHolder: false
  },
  [QuestionType.DropDown]: { 
    validations: {
      isRequired: true,
    }, 
    placeHolder: false },
  [QuestionType.Radio]: {
    validations: {
      isRequired: true,
    }, placeHolder: false
  },
  [QuestionType.CheckBox]: {
    attachedLabels: {
      max: 'Maximum',
      min: 'Minimum'
    },
    validations: {
      isRequired: true,
      isValidCheckedItems: true
    }, placeHolder: false
  },
  [QuestionType.BarCode]: {
    validations: {
      isRequired: true,
    }
  },
  [QuestionType.QRCode]: {
    validations: {
      isRequired: true,
    }
  },
  [QuestionType.FileUpload]: {
    validations: {
      isRequired: true,
    }, placeHolder: false,
    multiple: true
  },
  [QuestionType.CapturePhoto]: {
    validations: {
      isRequired: true,
    }, placeHolder: false
  },
  [QuestionType.Survey]: {
    validations: {
      isRequired: true,
    }, placeHolder: false
  },
  [QuestionType.Money]: {
    validations: {
      isRequired: true,
      numberIsRange: true,
      isCurrency: true
    }, 
    placeHolder: false,
    mask: true
  },
  [QuestionType.URL]: {
    validations: {
      isRequired: true,
      isURL: true
    }, placeHolder: false
  }


};





export interface IActionButton {
  label: string,
  questionType: QuestionType,
  iconType: ElementType
}


export interface IFindRecords {
  sectionIndex: number;
  subSectionIndex: number;
  questionIndex: number,
  record: Section | SubSection | Question | undefined
}

export interface IShowSkipLogicCondition {
  questionId: string;
  questionLabel: string;
  operator: string;
  firstValue: string;
  secondValue?: string;
  showOnceOnly?: boolean
}

export interface IFormula {
  label: string; // holds age + 90, the question label
  refs: string; // holds uuuid + 90, the question id.
}

export interface Question {
  id: string;
  label: string;
  tooltip?: string;
  placeholder?: string;
  description?: string;
  type: QuestionType;
  gridType?: QuestionType;
  choices: IChoice[];
  subQuestions: string[], // questions inside survey
  validations: IFieldValidatorDetails[]
  formulaForCalculatedFieldType?: IFormula;
  isCalculated: boolean;
  mask?: string;
  maskExample?: string;
  prefix: string;
  suffix: string;
  multipleTimes: string;
  options: Record<string, any>
  euiType: EUIType,
  skipLogic: IShowSkipLogicCondition[],
  showLogic?: IShowSkipLogicCondition,
  textContent?: string
}

export interface IPreviewQuestionProps {
  question: Question,
  questionnaireContent?: Section[]
  isViewMode: boolean
}

export interface IViewQuestion {
  question: Question,
  questionnaireContent?: Section[]
  handleValidationReponse?: (validateMessage: string) => void,
  defaultValue?: string
}

export interface ICurrencyDetail {
  symbol: string;
  code: string;
  name: string;
}

export interface ILocation {
  lat?: number,
  long?: number
}


export interface IFilterQuestion {
  types: QuestionType[],
  excludeIds: string[]
}

export interface SubSection {
  id: string,
  euiType: EUIType,
  label: string,
  description: string,
  questions: Question[]
  skipLogic: IShowSkipLogicCondition[],
  showLogic?: IShowSkipLogicCondition
}

export interface Section {
  id: string,
  euiType: EUIType,
  label: string,
  description: string,
  content: (SubSection | Question)[],
  skipLogic: IShowSkipLogicCondition[],
  showLogic?: IShowSkipLogicCondition
}

export interface IDragAndDrop {
  draggedItemId: string;
  draggedItemType: string;
  droppedToItemId: string;
}

export interface IEditSecSubSection {
  id: string,
  label: string,
  description: string,
  skipLogic: IShowSkipLogicCondition[],
  showLogic?: IShowSkipLogicCondition
}

export interface ITrackActivity {
  sectionIndex: number,
  subSectionIndex: number,
  questionIndex: number,
  record: Section | SubSection | Question | undefined;
}
