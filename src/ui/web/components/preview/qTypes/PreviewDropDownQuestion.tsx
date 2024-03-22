import { IPreviewQuestionProps, IViewQuestion } from "@interfaces/appInterface";
import ErrorMessage from "../ErrorMessage";
import useHandleAnswering from "@hooks/useHandleAnswering";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// value={value} onValueChange={(e) => updateQuestion("multipleTimes", e)}
const ViewBuildMode: React.FC<IViewQuestion> = ({ question }) => {
    return <div>
        <Select>
            <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select One" />
            </SelectTrigger>
            <SelectContent>
                {question.choices?.map((choice, index) => (

                    <SelectItem key={`${question.id}-${index}`} value={choice.value}
                    >{choice.label}</SelectItem>

                ))}
            </SelectContent>
        </Select>
    </div>
}

const ViewFullMode: React.FC<IViewQuestion> = ({ question }) => {

    const {
        validationMessage,

        value,


        handleChange

    } = useHandleAnswering(question)



    return (
       <div>
        <Select value={value} onValueChange={(e)=>handleChange(e)}>
            <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select One" />
            </SelectTrigger>
            <SelectContent>
                {question.choices?.map((choice, index) => (

                    <SelectItem key={`${question.id}-${index}`} value={choice.value}
                    >{choice.label}</SelectItem>

                ))}
            </SelectContent>
        </Select>
        <ErrorMessage message={validationMessage} />
    </div>
    )
}

const PreviewDropDownQuestion: React.FC<IPreviewQuestionProps> = ({ question, isViewMode }) => {
    if (!isViewMode) return <ViewBuildMode question={question} />
    return <ViewFullMode question={question} />;
}

export default PreviewDropDownQuestion;