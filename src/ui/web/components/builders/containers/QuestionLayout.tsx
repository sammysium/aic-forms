import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"



import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { config } from "@utils/config"
import { generateId } from "@utils/utils"
import { EUIType, IChoice, ICurrencyDetail, IDateTimeOptions, IFormula, IShowSkipLogicCondition, Question, QuestionType, questionTypeOptions } from "@interfaces/appInterface"
import SkipLogicComponent from "../../shared/SkipLogic"
import IsRequiredValidator from "../validators/IsRequiredValidator"
import useFieldValidator from "@hooks/useFieldValidator"
import LengthValidator from "../validators/LengthValidator"
import TextValidator, { textValidationFunctionNames } from "../validators/TextValidator"
import isBefore from "validator/lib/isBefore"
import isEmpty from "validator/lib/isEmpty"
import isAfter from "validator/lib/isAfter"

import PreviewQuestion from "../../preview/PreviewQuestion"
import { Textarea } from "@/components/ui/textarea"
import ChoicesBuilder from "../../shared/Choices"
import DateTimeValidator from "../validators/DateTimeValidator"
import { currencyList } from "@data/currency"
import SurveyQuestionType from "../../shared/SurveyQuestionType"
import CalculatedField from "../../shared/CalculatedField"

export interface IProps {
  editQuestion?: Question,
  saveQuestion: (question: Question, isNew: boolean) => void,
  questionType: QuestionType

}

const generateNewQuestion = (questionType: QuestionType): Question => {
  return {
    id: generateId(),
    type: questionType,
    label: "",
    description: "",
    choices: [],
    subQuestions: [],
    prefix: "",
    suffix: "",
    validations: [],
    isCalculated: false,
    multipleTimes: "1",
    euiType: EUIType.Question,
    options: {},
    skipLogic: []
  }
}


export const QuestionLayout = ({ editQuestion, saveQuestion, questionType }: IProps) => {

  const [question, setQuestion] = useState<Question>(
    editQuestion ? editQuestion : generateNewQuestion(questionType)
  )
  const { validations, handleFieldValidator } = useFieldValidator(question.validations);
  
  const [fileUploadTypes, setFileUploadTypes] = useState<string[]>([])
  const [fileUploadMaxSize, setFileUploadMaxSize] = useState("")
  const currentOptions = question.options as any;
  const [dateTimeOptions, setDateTimeOptions] = useState<IDateTimeOptions>({
    showClock: currentOptions["showClock"] !== undefined ? currentOptions["showClock"] : false,
    startDate: currentOptions["startDate"],
    endDate: currentOptions["endDate"]
  })
  const [currentCurrencySelection, setCurrentCurrencySelection] = useState(currentOptions["currency"] ? currentOptions.currency.name : currencyList[0].name)

  const [enableMinDate, setEnableMinDate] = useState(dateTimeOptions.startDate ? true : false);
  const [enableMaxDate, setEnableMaxDate] = useState(dateTimeOptions.endDate ? true : false);



  useEffect(() => {
    question.validations = validations
  }, [validations, question])

  const questionOptions = questionTypeOptions[question.type]

  // direct property of a question
  const updateQuestion = (fieldName: string, value: string) => {

    setQuestion(prevQuestion => ({
      ...prevQuestion,
      [fieldName]: value
    }));
  }

  const updateQuestionOptionField = (key: string, value: string) => {
    const { options } = question;
    options[key] = value;
    setQuestion(prev=>({
      ...prev,
      options
    }))
  }

  const onHandleFormulaCreation = (formula?: IFormula) => {
    setQuestion(prevQuestion => ({
      ...prevQuestion,
      formulaForCalculatedFieldType: formula
    }));
  }



  const handleSkipLogic = (conditions: IShowSkipLogicCondition[]) => {

    setQuestion({
      ...question,
      skipLogic: conditions
    })

  }

  const handleSurveyQuestions = (subQuestions: string[]) => {
    setQuestion(prevQuestion => ({
      ...prevQuestion,
      subQuestions
    }));
  }

  const handleChoices = (choices: IChoice[]) => {
    setQuestion(prevQuestion => ({
      ...prevQuestion,
      choices
    }));
  }

  const handleSaveButton = () => {
    if (isEmpty(question.label)) {
      alert('Question label cannot be empty')
      return;
    }
    if (
      (question.type === QuestionType.CheckBox || question.type === QuestionType.Radio || question.type === QuestionType.Survey) &&
      question.choices.length < 2) {
      alert('You must provide at least two choices');
      return;
    }

    if (question.type === QuestionType.Survey && question.subQuestions.length < 1) {
      alert('You must provide at least one sub question');
      return;
    }

    if (questionType === QuestionType.FileUpload) {

      const options  = {
        "fileExts": fileUploadTypes,
        "maxFileSize": fileUploadMaxSize
      }
      setQuestion(prev=>({
        ...prev,
        options
      }))
    }

    const updatedValidations = [...validations];
    // add built in validations
    if (questionOptions?.validations?.isEmail === true) {
      updatedValidations.push({
        keepValidation: true,
        validationFunctionName: "isEmail",
        validationOptions: {}
      });
    }
    if (questionOptions?.validations?.isURL === true) {
      updatedValidations.push({
        keepValidation: true,
        validationFunctionName: "isURL",
        validationOptions: {}
      });
    }
    if (questionType === QuestionType.TermsAndConditions || questionType === QuestionType.Signature) {
      updatedValidations.push({
        keepValidation: true,
        validationFunctionName: "isEmpty",
        validationOptions: {}
      });
    }
    if (questionType === QuestionType.Money) {
      updatedValidations.push({
        keepValidation: true,
        validationFunctionName: "isMoney",
        validationOptions: {}
      });
    }
    //Hack: >1 text validations could be added to a question.
    // keep the last one only
    const textValidationIndexes: number[] = []
    updatedValidations.forEach((v, index) => {
      if (textValidationFunctionNames.indexOf(v.validationFunctionName) > -1) {
        textValidationIndexes.push(index)
      }
    });
    for (let i = textValidationIndexes.length - 2; i >= 0; i--) {
      updatedValidations.splice(textValidationIndexes[i], 1);
    }

    setQuestion(prev=>({
      ...prev,
      validations: updatedValidations
    }))


    saveQuestion(question, editQuestion ? false : true)
  }

  const handleIsCalculated = (status: boolean) => {
    setQuestion({
      ...question,
      isCalculated: status,
      multipleTimes: status ? "1" : question.multipleTimes
    }

    )
  }

  const updateQuestionDateOptions = (newDTUpdates: IDateTimeOptions) => {
    setQuestion({
      ...question,
      options: newDTUpdates
    })
  }


  const handleDateTimeToggleOptions = (fieldName: string) => {
    const name = fieldName as keyof IDateTimeOptions

    const currentOptions = { ...dateTimeOptions, [name]: !dateTimeOptions[name] }
    setDateTimeOptions(currentOptions)
    updateQuestionDateOptions(currentOptions)
  };


  const buildExtraQuestionOptions = () => {
    const options = questionTypeOptions[questionType]

    if (options === undefined) {
      return <></>
    }
    const ui: JSX.Element[] = [];

    if (options.calculatableField === true) {
      ui.push(<div className='flex flex-row gap-4' key="calculatableField">
        <label>Is Calculated?</label>
        <input type="checkbox"
          checked={question.isCalculated}
          value={question.isCalculated === true ? "checked" : ""}
          className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          onChange={(e) => handleIsCalculated(e.target.checked)}
        />

      </div>)
    }

    if (options.mask === true) {

      ui.push(<div className="grid w-full max-w-sm items-center gap-1.5 my-2" key="mask">
        <Label htmlFor="maskingInput">Mask</Label>
        <Input type="text" id="maskingInput" placeholder="Enter masking (optional)" value={question.mask} onChange={(e) => updateQuestion("mask", e.target.value)} />
      </div>)

      ui.push(<div className="grid w-full max-w-sm items-center gap-1.5 my-2" key="maskEg">
        <Label htmlFor="maskingInputEg">Mask E.g.</Label>
        <Input type="text" id="maskingInputEg" placeholder="Enter masking example (optional)" value={question.maskExample} onChange={(e) => updateQuestion("maskExample", e.target.value)} />
      </div>)

    }

    if (options.multiple === true) {

      ui.push(
        <div className="grid w-full max-w-sm items-center gap-1.5 my-2" key="multiple">
          <Label htmlFor="multiples">Multiples</Label>
          <Select value={question.multipleTimes} onValueChange={(e) => updateQuestion("multipleTimes", e)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Value" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Array.from({ length: config.multiplesFieldMaxValue }, (_, index) => (
                  <SelectItem key={index} value={(index + 1).toString()}>
                    {index + 1}
                  </SelectItem>
                ))}

              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )
    }



    if (options.proximity === true) {
      ui.push(<div className="grid w-full max-w-sm items-center gap-1.5 my-2" key="proximity">
        <Label htmlFor="maskingInputEg">Proximity</Label>
        <Input type="text" id="proximity" placeholder="Enter masking proximity (optional)" value={question.options.proximity} onChange={(e) => updateQuestionOptionField("proximity", e.target.value)} />
      </div>)
    }

    return ui;
  }
  const handleDateTimeMinMax = (fieldName: string, state: boolean) => {
    const name = fieldName as keyof IDateTimeOptions;
    if (!state) {
      const currentOptions = { ...dateTimeOptions, [name]: undefined }

      setDateTimeOptions(currentOptions)
      updateQuestionDateOptions(currentOptions)
    }
    if (fieldName === 'startDate') {
      setEnableMinDate(state)
    } else {
      setEnableMaxDate(state)
    }

  }

  const handleDateSelection = (fieldName: string, selectedDate: Date) => {
    if (fieldName === "endDate" && enableMinDate === true) {
      if (dateTimeOptions.startDate === undefined) {
        alert("First set starting date");
        return;
      }
      // end must be after start
      if (isBefore(selectedDate.toDateString(), dateTimeOptions.startDate.toDateString())) {
        alert("End date must be after start date");
        return;
      }

    }

    if (fieldName === "startDate" && enableMaxDate === true && dateTimeOptions.endDate !== undefined) {
      if (isAfter(selectedDate.toDateString(), dateTimeOptions.endDate.toDateString())) {
        alert("End date must be after start date");
        return;
      }
    }
    const name = fieldName as keyof IDateTimeOptions;
    const currentOptions = { ...dateTimeOptions, [name]: selectedDate }
    setDateTimeOptions(currentOptions)
    updateQuestionDateOptions(currentOptions)
  }

  const DateTimeQuestionDataOptions = () => {
    return (<div className="flex flex-col w-full">


      <div className="flex items-center space-x-2 my-3">

        <input type="checkbox"
          checked={dateTimeOptions.showClock}
          onChange={(e) => handleDateTimeToggleOptions("showClock")}
          className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
        />

        <label

          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Show Clock
        </label>



      </div>


      <div className="flex items-center space-x-2 my-3">

        <input type="checkbox"
          checked={enableMinDate}

          onChange={(e) => handleDateTimeMinMax("startDate", e.target.checked)}
          className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
        />

        <label

          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Enable Min Date
        </label>

        {enableMinDate && (
          <input
            value={
              dateTimeOptions.startDate ? dateTimeOptions.startDate.toDateString() : new Date().toDateString()}
            onBlur={(e) => handleDateSelection("startDate", new Date(e.target.value))}
            type="date"
            onChange={(e) => handleDateSelection("startDate", new Date(e.target.value))}
          />

        )}

      </div>

      <div className="flex items-center space-x-2 my-3">

        <input type="checkbox"
          checked={dateTimeOptions.endDate ? true : false}
          onChange={(e) => handleDateTimeMinMax("endDate", e.target.checked)}
          className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
        />

        <label

          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Enable Max Date
        </label>


        {enableMaxDate && (
          <input
            onBlur={(e) => handleDateSelection("endDate", new Date(e.target.value))}
            type="date" onChange={(e) => handleDateSelection("endDate", new Date(e.target.value))} />
        )}



      </div>



    </div>)
  }

  const handleFileExtCheckBoxes = (ext: string, state: boolean) => {
    const currentExts = [...fileUploadTypes]
    const currentIndex = currentExts.indexOf(ext)
    if (state && currentIndex === -1) {
      currentExts.push(ext)
    } else if (!state && currentIndex > -1) {
      currentExts.splice(currentIndex, 1)
    }
    setFileUploadTypes(currentExts)
  }


  const handleCurrencyOption = (selectedCurrencyName: string) => {

    const currency = currencyList.find(c => c.name === selectedCurrencyName) as ICurrencyDetail
    if (currency) {

      updateQuestion("prefix", currency.symbol)
      updateQuestion("suffix", currency.code)
      setCurrentCurrencySelection(selectedCurrencyName)
    }

  }

  const CurrencyData = () => {
    return (<div className="grid w-full max-w-sm items-center gap-1.5 my-2">
      <Label htmlFor="currency">Currency</Label>
      <Select value={currentCurrencySelection} onValueChange={(e) => handleCurrencyOption(e)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Currency" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {currencyList.map(currency => (
              <SelectItem key={`${currency.code}_${currency.symbol}_${currency.name}`} value={currency.name}>
                {currency.name} ({currency.code})
              </SelectItem>
            ))}

          </SelectGroup>
        </SelectContent>
      </Select>
    </div>)
  }

  return (<div className="container mx-auto px-4">
    <div className="flex">
      <div className="w-4/6 flex flex-col h-full">

        <Tabs defaultValue="display" className="w-full flex-grow">
          <TabsList>
            <TabsTrigger value="display">Display</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="validation">Validation</TabsTrigger>
            <TabsTrigger value="skipLogic">Skip Logic</TabsTrigger>
          </TabsList>
          <TabsContent value="display">

            <div className="flex flex-col">

              <div className="grid w-full max-w-sm items-center gap-1.5 my-2">
                <Label htmlFor="label">Label</Label>
                <Input type="text" id="label" placeholder="Enter question label" value={question.label} onChange={(e) => updateQuestion("label", e.target.value)} />
              </div>

              {questionOptions?.placeHolder === true && (
                <div className="grid w-full max-w-sm items-center gap-1.5 my-2">
                  <Label htmlFor="placeholder">Placeholder</Label>
                  <Input type="text" id="placeholder" placeholder="Enter question placeholder" value={question.placeholder} onChange={(e) => updateQuestion("placeholder", e.target.value)} />
                </div>
              )}

              <div className="grid w-full max-w-sm items-center gap-1.5 my-2">
                <Label htmlFor="desc">Description</Label>
                <Input type="text" id="desc" placeholder="Enter question description" value={question.description} onChange={(e) => updateQuestion("description", e.target.value)} />
              </div>

              <div className="grid w-full max-w-sm items-center gap-1.5 my-2">
                <Label htmlFor="tooltip">Tooltip</Label>
                <Input type="text" id="tooltip" placeholder="Enter question tooltip" value={question.tooltip} onChange={(e) => updateQuestion("tooltip", e.target.value)} />
              </div>

              {questionOptions?.sufPrefix === true && (<>
                <div className="grid w-full max-w-sm items-center gap-1.5 my-2">
                  <Label htmlFor="prefix">Prefix</Label>
                  <Input type="text" id="prefix" placeholder="Enter prefix" value={question.prefix} onChange={(e) => updateQuestion("prefix", e.target.value)} />
                </div>

                <div className="grid w-full max-w-sm items-center gap-1.5 my-2">
                  <Label htmlFor="suffix">Suffix</Label>
                  <Input type="text" id="suffix" placeholder="Enter suffix" value={question.suffix} onChange={(e) => updateQuestion("suffix", e.target.value)} />
                </div>

              </>)}

            </div>

          </TabsContent>
          <TabsContent value="data">

            {questionType === QuestionType.Survey && (
              <SurveyQuestionType question={question} handleChoices={handleChoices} handleSurveyQuestions={handleSurveyQuestions}/>
            )}

            {questionType === QuestionType.FileUpload && (
              <>
                <h3>File Types</h3>
                {config.uploadDocTypes.map(docType => (
                  <div className='flex items-center gap-4' key={docType}>

                    <input type="checkbox"
                      checked={fileUploadTypes.indexOf(docType) > -1}
                      value={docType}
                      className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                      onChange={(e) => handleFileExtCheckBoxes(e.target.value, e.target.checked)}
                    />

                    <label>{docType}</label>
                  </div>
                ))}
                <div className="mt-5">
                  <h3>Max File Size</h3>
                  <Input type="text" value={fileUploadMaxSize} onChange={(e) => setFileUploadMaxSize(e.target.value)} />
                </div>
              </>
            )}

            {questionType === QuestionType.Money && (
              <CurrencyData />
            )}

            {questionType === QuestionType.DateTime && (
              <DateTimeQuestionDataOptions />
            )}

            {questionType === QuestionType.TermsAndConditions && (
              <div className="grid w-full max-w-sm items-center gap-1.5 my-2" key="termsAndConditions">
                <Label htmlFor="multiples">Terms and Agreements</Label>
                <Textarea
                  onChange={(e) => updateQuestion("textContent", e.target.value)}
                >{question.textContent}</Textarea>

              </div>
            )}

            {(questionType === QuestionType.Radio || questionType === QuestionType.CheckBox || questionType === QuestionType.DropDown) && (
              <ChoicesBuilder question={question} handleChoices={handleChoices} />
            )}




            {buildExtraQuestionOptions()}

            {question.isCalculated === true && (
              <CalculatedField currentFormula={question.formulaForCalculatedFieldType} onHandleFormulaCreation={onHandleFormulaCreation}/>
            )}

          </TabsContent>
          <TabsContent value="validation">
            {questionOptions?.validations?.isRequired === true && (
              <IsRequiredValidator question={question} handleFieldValidator={handleFieldValidator} />
            )}

            {questionOptions?.validations?.numberIsRange === true && (
              <LengthValidator
                minLabel={questionOptions.attachedLabels?.min}
                maxLabel={questionOptions.attachedLabels?.max}
                selectedValidator="numberIsRange" question={question} handleFieldValidator={handleFieldValidator} />
            )}


            {questionOptions?.validations?.isValidCheckedItems === true && (
              <LengthValidator
                minLabel={questionOptions.attachedLabels?.min}
                maxLabel={questionOptions.attachedLabels?.max}
                selectedValidator="isValidCheckedItems" question={question} handleFieldValidator={handleFieldValidator} />
            )}

            {questionOptions?.validations?.textValidation && (
              <TextValidator question={question} handleFieldValidator={handleFieldValidator} />
            )}

            {questionOptions?.validations?.dateTime && (
              <DateTimeValidator question={question} handleFieldValidator={handleFieldValidator} />
            )}


          </TabsContent>
          <TabsContent value="skipLogic">{
            <SkipLogicComponent onHandleSkipLogic={handleSkipLogic} currentConditions={question.skipLogic} />
          }</TabsContent>
        </Tabs>


      </div>
      <div className="w-2/6 ml-4 border-2 mt-8 border-gray border-solid">
        <div className="bg-gray-100 text-white flex items-center justify-between px-4 py-2">
          <span className="text-lg text-black">Preview</span>
        </div>
        <PreviewQuestion questionnaireContent={[]}  question={question} isViewMode={false} handleQuestionDeletion={(id)=>console.log(id)} handleQuestionEdit={(id)=>console.log(id)}  />
      </div>
    </div>
    <div className="w-[180px] mt-5 mb-0">

      <Button variant="readyActionSmall" onClick={handleSaveButton}>Save Question</Button>

    </div>
  </div>


  )
}