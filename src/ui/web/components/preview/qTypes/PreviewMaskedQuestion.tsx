import { Input } from "@/components/ui/input";
import { useRunValidations } from "@hooks/useRunValidations";
import { IViewQuestion, Question } from "@interfaces/appInterface";
import { useState } from "react";
import { styles } from "@styles/styles";
import { maskInput } from "@utils/inputFormatters";
import ErrorMessage from "../ErrorMessage";

interface IProps {
    question: Question,
    isViewMode: boolean,
    defaultValue?: string
}
const ViewBuildMode: React.FC<IViewQuestion> = ({ question }) => {
    return <Input type="text" placeholder={question.mask} />;
}

const ViewFullMode: React.FC<IViewQuestion> = ({ question, defaultValue }) => {
    const [value, setValue] = useState(defaultValue ? defaultValue : '')
    const mask = question.mask
    const { validationMessage } = useRunValidations(value, question.validations)

    const handleChange = (v: string) => {
        setValue(maskInput(v, mask))
    }

    return <div className={styles.questions.container}>
        <Input
        placeholder={mask}
        value={value}
        onChange={(e)=>handleChange(e.target.value)}
    />   
    <div><span>{question.maskExample}</span></div>
    <ErrorMessage message={validationMessage} />
    </div>
}

const PreviewMaskedQuestion : React.FC<IProps> = ( {question, isViewMode, defaultValue}) => {
    if (!isViewMode) return <ViewBuildMode question={question} />
    return <ViewFullMode question={question} defaultValue={defaultValue ? defaultValue : ''} />
   
}

export default PreviewMaskedQuestion;