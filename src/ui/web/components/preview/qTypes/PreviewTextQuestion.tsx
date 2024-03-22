import { IPreviewQuestionProps, IViewQuestion } from "@interfaces/appInterface";
import { Input } from "@/components/ui/input"
import ErrorMessage from "../ErrorMessage";
import { uiFromValidations } from "@utils/utils";
import DisplayQuestionMultipleTimes from "../../shared/DisplayQuestionMultipleTimes";
import useHandleAnswering from "@hooks/useHandleAnswering";

const ViewBuildMode: React.FC<IViewQuestion> = ({ question }) => {
    return <Input type="text" placeholder={question.placeholder} />;
}

const ViewFullMode: React.FC<IViewQuestion> = ({ question, questionnaireContent }) => {
   
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

    } = useHandleAnswering(question, questionnaireContent)


    const controls = uiFromValidations(question.validations)


    if (showHowManyTimes === 1) {
        return (<div>
            <Input
                type="text"
                placeholder={question.placeholder}
                value={value}
                onChange={(e) => handleChange(e.target.value)}
                maxLength={controls.max}
                minLength={controls.min}
                readOnly={question.isCalculated}
            />
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
            type="text"
            placeholder={question.placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            maxLength={controls.max}
            minLength={controls.min}
        />
        <ErrorMessage message={validationMessage} />
    </DisplayQuestionMultipleTimes>


}

const PreviewTextQuestion: React.FC<IPreviewQuestionProps> = ({ question, isViewMode, questionnaireContent }) => {
    if (!isViewMode) return <ViewBuildMode question={question} />
    return <ViewFullMode question={question} questionnaireContent={questionnaireContent}/>;

}

export default PreviewTextQuestion;