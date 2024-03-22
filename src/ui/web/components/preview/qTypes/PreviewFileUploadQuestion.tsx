

import useHandleAnswering from "@hooks/useHandleAnswering";
import { IPreviewQuestionProps, IViewQuestion } from "@interfaces/appInterface";

import ErrorMessage from "../ErrorMessage";
import DisplayQuestionMultipleTimes from "../../shared/DisplayQuestionMultipleTimes";
import { Input } from "@/components/ui/input";

const ViewBuildMode: React.FC<IViewQuestion> = ({question}) => {
    return <input type="file" placeholder={question.placeholder} />
}
const ViewFullMode: React.FC<IViewQuestion> = ({ question }) => {
   
    const {
        validationMessage,
        showHowManyTimes,
        value,
        setValue,
        handleMultipleAnswers,
        updateMultiAnswer,
        removeMultiAnswer,
        handleChange,
        multipleAnswers

    } = useHandleAnswering(question)

    if (showHowManyTimes === 1) {
      return (<div>
          <input type="file" placeholder={question.placeholder} />
          <ErrorMessage message={validationMessage} />
      </div>
      )
    }
    return <DisplayQuestionMultipleTimes
    question={question}
    handleMultipleAnswers={handleMultipleAnswers}
    handleRemoveAnswer={removeMultiAnswer}
    handleUpdateAnswer={updateMultiAnswer}
    maxNumberToShow={showHowManyTimes}
    existingCSVAnswers={
        multipleAnswers
    }
>
    <Input
        type="file"
        placeholder={question.placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
    />
    <ErrorMessage message={validationMessage} />
</DisplayQuestionMultipleTimes>

}


const PreviewFileUploadQuestion : React.FC<IPreviewQuestionProps> = ({ question, isViewMode }) => {
    if (!isViewMode) return <ViewBuildMode question={question} />
    return <ViewFullMode question={question} />
};

export default PreviewFileUploadQuestion;