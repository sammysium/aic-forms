

import React, { useContext, useState } from 'react';
import { EOperator, IShowSkipLogicCondition, Question, QuestionType } from '../../../../interfaces/appInterface';
import { AppContext, IAppContext } from "@contexts/AppContext";
import { useGetFilteredQuestions } from "@hooks/useGetFilteredQuestions";
import { getFilteredQuestions } from "@utils/search";
import { isValidEOperator } from "@utils/utils";


interface ShowLogicProps {
    onHandleShowLogic: (skipConditions: IShowSkipLogicCondition | undefined) => void;
    currentCondition?: IShowSkipLogicCondition
}


const ShowLogic: React.FC<ShowLogicProps> = ({ onHandleShowLogic, currentCondition }) => {
    const { content } = useContext(AppContext) as IAppContext
    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
    const [selectedOperator, setSelectedOperator] = useState<EOperator | null>(null);
    const [firstValue, setFirstValue] = useState("")
    const [secondValue, setSecondValue] = useState("")
    const [showOnceOnly, setShowOnceOnly] = useState(false)
    const [condition, setCondition] = useState<IShowSkipLogicCondition | undefined>(currentCondition)
    const validQuestions  = getFilteredQuestions(content, {
        types: [QuestionType.Number, QuestionType.DropDown, QuestionType.Radio, QuestionType.CheckBox],
        excludeIds: []
    })

 

    const setOperator = (option: EOperator) => {
        if (isValidEOperator(option)) {
     
            setSelectedOperator(option)
          } else {
            // option is not a valid EOperator
            // Handle the case when option is not a valid EOperator
            setSelectedOperator(null)
          }
    }

    const addLogic = () => {
        
        if (selectedQuestion && selectedOperator) {

            const condition: IShowSkipLogicCondition = {
                questionId: selectedQuestion.id,
                questionLabel: selectedQuestion.label,
                operator: selectedOperator,
                firstValue,
                showOnceOnly
            }

            if (selectedOperator === "between") {
                condition.secondValue = secondValue;
            }

            onHandleShowLogic(condition)
            setCondition(condition)

            setSelectedOperator(EOperator.ON)
            setSelectedQuestion(null)
            setFirstValue("")
            setSecondValue("")

        }
        
    }

    const clearConditions = () => {
        onHandleShowLogic(undefined)
        setCondition(undefined)

    };


    const handleQuestionSelection = (questionIndex: number) => {
        if (questionIndex === -1) {
            setSelectedQuestion(null)
        } else {
            const question = validQuestions[questionIndex]
            setSelectedQuestion(question);
        }

    }

    return (<>
        <div className="flex items-center justify-center w-full">

            <div className="w-full rounded-md shadow-md p-6 space-y-4">


                {condition && (
                    <>
                        {condition.questionLabel} {condition.operator} {condition.firstValue} {condition.secondValue !== undefined && <span>condition.secondValue</span>}
                        <button
                            onClick={() => clearConditions()}
                            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">Clear</button>
                    </>
                )}
            </div>
        </div>
        {validQuestions.length > 0 && (
            <div className="flex w-full">
                <div className="w-1/4 p-4 mr-2">
                    <select onChange={(e) => handleQuestionSelection(parseInt(e.target.value, 10))}>
                        <option value="-1">Select Field</option>
                        {validQuestions.map((question, index) => {

                            return (<option value={index} key={question.id}>{question.label}</option>)
                        })}
                    </select>
                </div>
             
                <div className="w-1/4 p-4 mr-2">


                    {selectedQuestion && (
                        <>
                            <select onChange={(e) => setOperator(e.target.value as EOperator)}>
                           <option value="none">Select One</option>
                            {selectedQuestion.type !== QuestionType.CheckBox && (<option value={EOperator.ON}>Equal To</option>)}
                            {selectedQuestion.type === QuestionType.CheckBox && (<option value={EOperator.CONTAINS}>Contains</option>)}
                            {[QuestionType.Number, QuestionType.Money].includes(selectedQuestion.type) && (

                                <>
                                    <option value={EOperator.BEFORE}>Less Than</option>
                                    <option value={EOperator.BEFOREORON}>Less Than or Equal To</option>
                                    <option value={EOperator.AFTER}>Greater Than</option>
                                    <option value={EOperator.AFTERORON}>Greater Than or Equal To</option>
                                    <option value={EOperator.BETWEEN}>Between</option>

                                </>
                            )}

                                </select>
                  </>

                    )}



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

                <div>
                    Show Once Only <input type="checkbox" onChange={(e) => setShowOnceOnly(e.target.checked)} />
                </div>


                <div className="w-1/4 p-4 flex items-center justify-end">
                    <button
                        onClick={() => addLogic()}
                        disabled={selectedQuestion === null}
                        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">Add Condition</button>
                </div>




            </div>
        )}
    </>);

}

export default ShowLogic;