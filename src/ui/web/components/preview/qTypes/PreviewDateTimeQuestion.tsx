
import { IPreviewQuestionProps, IViewQuestion } from "@interfaces/appInterface";
import DateTimeSelector from "../../shared/DateTimeSelector";
import ErrorMessage from "../ErrorMessage";
import useHandleAnswering from "@hooks/useHandleAnswering";


const ViewBuildMode: React.FC<IViewQuestion> = ({ question }) => {
    return <input type="datetime-local"  />
}

const ViewFullMode: React.FC<IViewQuestion> = ({ question }) => {
    const currentOptions = question.options as any;
    const options = {
        showClock : currentOptions["showClock"] !== undefined ? currentOptions["showClock"] : false,
        minDateRange: currentOptions["startDate"],
        maxDateRange: currentOptions["endDate"],
        showRange: false,
    }

    options.showRange = options.maxDateRange !== undefined && options.minDateRange !== undefined;


    const {
        validationMessage,
        handleChange

    } = useHandleAnswering(question)


    const onChange = (selectedDate: Date) => {
        handleChange(selectedDate.toDateString())
    }


    return (<div>
        <DateTimeSelector 
                showTimeSelect= {options.showClock} 
                maxDateRange={options.maxDateRange}
                minDateRange={options.minDateRange}
                onChange = {onChange}
                showRange = {options.showRange}
                editMode = {false}
                />

        <ErrorMessage message={validationMessage} />
    </div>
    )

}

const PreviewDateTimeQuestion: React.FC<IPreviewQuestionProps> = ({ question, isViewMode }) => {
    if (!isViewMode) return <ViewBuildMode question={question} />
    return <ViewFullMode question={question} />
};

export default PreviewDateTimeQuestion;