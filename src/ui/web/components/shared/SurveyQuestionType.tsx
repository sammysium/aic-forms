import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IChoice, Question } from "@interfaces/appInterface";
import Choices from "./Choices";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import isEmpty from "validator/lib/isEmpty"
import { MdDelete, MdSort } from "react-icons/md";

interface IProps {
    question: Question,
    handleChoices: (choices: IChoice[]) => void,
    handleSurveyQuestions: (questions: string[]) => void
}

const SurveyQuestionType: React.FC<IProps> = ({handleChoices, question, handleSurveyQuestions}) => {
    const [subQuestions, setSubQuestions] = useState<string[]>([])
    const [questionTitle ,setQuestionTitle] = useState("")

    const handleAddQuestion = () => {
        if (isEmpty(questionTitle)) {
          alert('add title');
          return;
        }
        const title = questionTitle.trim();
        if (subQuestions.includes(title)) {
          alert('Question exists already')
          return;
        }
        const updatedSubQuestions = [...subQuestions, questionTitle]
        setSubQuestions(updatedSubQuestions);
        setQuestionTitle('')
        handleSurveyQuestions(updatedSubQuestions)
      };
    
      const handleRemoveQuestion = (label: string) => {
        const index = subQuestions.indexOf(label)
        if (index === -1) return;
        const updatedSubQuestions = [...subQuestions.slice(0, index), ...subQuestions.slice(index + 1)];
        setSubQuestions(updatedSubQuestions);
        handleSurveyQuestions(updatedSubQuestions)
      };

      const updateSubQuestion = (v: string, index: number) => {
        const newLabel = v.trim()
        if (subQuestions[index] === newLabel) return;
        const currentSubQuestions = [...subQuestions];
        currentSubQuestions[index] = newLabel;
        setSubQuestions(currentSubQuestions)
        handleSurveyQuestions(currentSubQuestions)
    
      }

      
    return (
        <Tabs defaultValue="questions" className="w-full flex-grow">
          <TabsList>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="choices">Choices</TabsTrigger>
  
          </TabsList>
          <TabsContent value="choices"><Choices handleChoices={handleChoices} question={question} /></TabsContent>
          <TabsContent value="questions">
  
            {subQuestions.map((subQuestion, index) => (
              <div className='flex flex-row my-5' key={subQuestion}>
                <div className='w-[45px] pt-2'><MdSort /></div>
                <div className='w-[450px] mx-10'>
                  <Input value={subQuestion} onChange={(e) => updateSubQuestion(e.target.value, index)} />
                </div>
  
                <div className='w-[100px] px-3 flex-row flex'>
                  <Button variant="readyActionSmall" className='bg-red-500' onClick={() => handleRemoveQuestion(subQuestion)}><MdDelete /></Button>
                </div>
              </div>
            ))}
  
  
  
            <div className='my-5 flex flex-col justify-items space-between'>
  
              <Input type="text" id="questionTitle" placeholder="Enter sub-question" value={questionTitle} onChange={(e) => setQuestionTitle(e.target.value)} />
  
  
              <Button variant="readyActionSmall" className='w-[180px]' onClick={handleAddQuestion}>Add Question</Button>
            </div>
  
          </TabsContent>
  
        </Tabs>
  
  
      )
}

export default SurveyQuestionType;