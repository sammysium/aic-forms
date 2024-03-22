

import React, { useContext, useState } from 'react';
import { IFormula, Question, QuestionType } from '../../../../interfaces/appInterface';
import { AppContext, IAppContext } from "@contexts/AppContext";
import { getFilteredQuestions } from "@utils/search";
import isEmpty from 'validator/lib/isEmpty';
import { Button } from '@/components/ui/button';



interface IProps {
    onHandleFormulaCreation: (formula?: IFormula) => void;
    currentFormula?: IFormula
}

const extractVariables = (str: string) => {
    const regex = /@[\w\d]+/g;
    return (str.match(regex) || []).map((match) => match.substring(1));
  };

const CalculatedField: React.FC<IProps> = ({ onHandleFormulaCreation, currentFormula }) => {
    const { content } = useContext(AppContext) as IAppContext
    const label = currentFormula?.label
    const refs = currentFormula?.refs
    const [formula, setFormula] = useState<IFormula>({
        label: label === undefined ? "" : label,
        refs: refs === undefined ? "" : refs
    })

    const initialLabelMaps = (currentFormula?: IFormula) => {
        if (!currentFormula) return {}
        const labelVariables = extractVariables(currentFormula.label);
      const refVariables = extractVariables(currentFormula.refs);
      
      // Create pairs of label and ref
      // Create pairs of label and ref
      const pairs = labelVariables.reduce((result, variable, index) => {
        // Use type assertion here
        (result as any)[variable] = refVariables[index];
        return result;
      }, {});
      
        return pairs
      }

    const validQuestions = getFilteredQuestions(content, {
        types: [QuestionType.Number],
        excludeIds: []
    })
    const [showQuestions, setShowQuestions] = useState(false);
    const [labelsMapToId, setLabelsMapToId] = useState<{ [key: string]: string }>(initialLabelMaps(currentFormula))

    const clearFormula = () => {
        onHandleFormulaCreation(undefined)
        setFormula({label: "", refs: ""});
    };


    const handleInputChange = (value: string) => {
        setFormula(previous => ({
            ...previous,
            label: value
        }))
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key === "@") {
            setShowQuestions(true)
        }
    }

    const handleQuestionClick = (question: Question) => {
        setShowQuestions(false);
        const label = `@${question.label}`
        setLabelsMapToId(pre => ({
            ...pre,
            [label]: question.id
        }))
        setFormula(pre => ({
            ...pre,
            label: `${pre.label}${question.label}`,
        }))
    };


    const saveQuestion = () => {
        if (isEmpty(formula.label)) {
            alert('You must add formula')
            return;
        }

        let refs = formula.label;
        for (const [key, value] of Object.entries(labelsMapToId)) {
            const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            refs = refs.replace(regex, `@${value}`);
        }

        onHandleFormulaCreation({label: formula.label, refs})
    };


    return (
        <div className='flex flex-col'>
            <div className='my-5'>
                Current Formula: {currentFormula?.label}
            </div>

            <input
                type="text"
                value={formula.label}
                onKeyDown={handleKeyPress}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Type @ for questions"
                className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
            />
            {showQuestions && (
                <ul className="absolute bg-white border border-gray-300 mt-1 w-3/6 rounded-md shadow-md z-10">
                    {validQuestions.map((question, index) => {
                        

                        return (<li key={question.id} onClick={() => handleQuestionClick(question)}
                            className={`px-4 py-3 hover:bg-gray-100 cursor-pointer select-none ${index !== validQuestions.length - 1 ? 'border-b border-gray-200' : ''
                                }`}
                        >
                            {question.label}
                        </li>);
                    })}
                </ul>

            )}

            <Button variant="readyActionSmall" className='w-[180px] mt-3'
                onClick={() => saveQuestion()}
            >
                Add Formula
            </Button>

        </div>
    );




}

export default CalculatedField;