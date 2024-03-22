
import { Textarea } from "@/components/ui/textarea"

import useHandleAnswering from "@hooks/useHandleAnswering";
import { IPreviewQuestionProps, IViewQuestion } from "@interfaces/appInterface";

import ErrorMessage from "../ErrorMessage";
import { uiFromValidations } from "@utils/utils";



const ViewBuildMode: React.FC<IViewQuestion> = ({question}) => {
    return <Textarea placeholder={question.placeholder} />
}
const ViewFullMode: React.FC<IViewQuestion> = ({ question }) => {
   
  const {
      validationMessage,
 
      value,
  
      handleChange

  } = useHandleAnswering(question)


  const controls = uiFromValidations(question.validations)




      return (<div>
          <Textarea
              
              placeholder={question.placeholder}
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              maxLength={controls.max}
              minLength={controls.min}
          />
          <ErrorMessage message={validationMessage} />
      </div>
      )

}


const PreviewTextAreaQuestion : React.FC<IPreviewQuestionProps> = ({ question, isViewMode }) => {
    if (!isViewMode) return <ViewBuildMode question={question} />
    return <ViewFullMode question={question} />
};

export default PreviewTextAreaQuestion;