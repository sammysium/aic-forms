

import React, { useContext, useState } from 'react';
import { EOperator, IShowSkipLogicCondition, Question, QuestionType } from '../../../../interfaces/appInterface';
import { AppContext, IAppContext } from "@contexts/AppContext";
import { getFilteredQuestions } from "@utils/search";



interface SkipLogicComponentProps {
  onHandleSkipLogic: (skipConditions: IShowSkipLogicCondition[]) => void;
  currentConditions: IShowSkipLogicCondition[]
}


const SkipLogicComponent: React.FC<SkipLogicComponentProps> = ({onHandleSkipLogic, currentConditions}) => {

  const { content } = useContext(AppContext) as IAppContext
  const [conditions, setConditions] = useState<IShowSkipLogicCondition[]>(currentConditions)
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [selectedOperator, setSelectedOperator] = useState<EOperator>(EOperator.ON);
  const [firstValue, setFirstValue] = useState("")
  const [secondValue, setSecondValue] = useState("")
  const validQuestions  = getFilteredQuestions(content, {
    types: [QuestionType.Number, QuestionType.DropDown, QuestionType.Radio],
    excludeIds: []
})




  const addLogic = () => {
    if (selectedQuestion) {

      const condition: IShowSkipLogicCondition = {
        questionId: selectedQuestion.id,
        questionLabel: selectedQuestion.label,
        operator: selectedOperator,
        firstValue
      }

      if (selectedOperator === "between") {
        condition.secondValue = secondValue;
      }
      const updatedConditions = [...conditions, condition]
      setConditions(updatedConditions);
      onHandleSkipLogic(updatedConditions)
  
      setSelectedOperator(EOperator.ON)
      setSelectedQuestion(null)
      setFirstValue("")
      setSecondValue("")

    }
  }

  const clearConditions = () => {
    onHandleSkipLogic([])
    setConditions([]);
  };


  const handleQuestionSelection = (questionIndex: number) => {
    if (questionIndex === -1){
      setSelectedQuestion(null)
    } else {
      const question = validQuestions[questionIndex]
      setSelectedQuestion(question);
    }
 
  }

  return (<>
    <div className="flex items-center justify-center w-full">

      <div className="w-full rounded-md shadow-md p-6 space-y-4">
        <div className="overflow-x-auto">
         {conditions.map((condition=> {
            if (condition.operator === 'between') {
              return (<p key={condition.questionId}><strong>{condition.questionLabel}</strong> {condition.operator} {condition.firstValue} AND {condition.secondValue}</p>)
            }
            return (<p key={condition.questionId}><strong>{condition.questionLabel}</strong> {condition.operator} {condition.firstValue}</p>)
         }))}

        </div>

        {conditions.length > 0 &&(<button 
        onClick={()=>clearConditions()}
        disabled={conditions.length === 0}
        className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">Clear</button>)}

      </div>
    </div>
    {validQuestions.length >0 &&(
    <div className="flex w-full">
      <div className="w-1/4 p-4 mr-2">
        <select onChange={(e) => handleQuestionSelection(parseInt(e.target.value, 10))}>
          <option value="-1">Select Field</option>
          {validQuestions.map((question, index) => {
           
            return (<option value={index} key={question.id}>{question.label}</option>)
          })}
        </select>
      </div>
      <div className="w-1/4 p-4 mr-2">  <select onChange={(e) => setSelectedOperator(e.target.value as EOperator)}>
        <option value={EOperator.ON}>Equal To</option>


        {[QuestionType.Number, QuestionType.Money, QuestionType.DropDown].includes(selectedQuestion?.type!!) && (

          <><option value={EOperator.BEFORE}>Less Than</option>
            <option value={EOperator.BEFOREORON}>Less Than or Equal To</option>
            <option value={EOperator.AFTER}>Greater Than</option>
            <option value={EOperator.AFTERORON}>Greater Than or Equal To</option>
            <option value={EOperator.BETWEEN}>Between</option>
          </>


        )}

      </select>
      </div>
      <div className="w-1/4 p-4 mr-2">
        <input
          type="text"
          placeholder="Smaller Value"
          onChange={e => setFirstValue(e.target.value)}
          value={firstValue}
          id="keyInput"
          className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
        /></div>

      {selectedOperator === "between" && (
        <div className="w-1/4 p-4 mr-2">
          <input
            type="text"
            value={secondValue}
            placeholder="Higher Value"
            onChange={e => setSecondValue(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
          /></div>

      )}


      <div className="w-1/4 p-4 flex items-center justify-end">
        <button 
        onClick={()=>addLogic()}
        disabled={selectedQuestion === null}
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">Add Condition</button>
      </div>




    </div>
    )}
  </>);

}

export default SkipLogicComponent;