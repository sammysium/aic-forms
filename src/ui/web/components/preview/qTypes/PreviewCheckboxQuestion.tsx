import { IPreviewQuestionProps, IViewQuestion } from "@interfaces/appInterface";
import ErrorMessage from "../ErrorMessage";
import useHandleAnswering from "@hooks/useHandleAnswering";
import { styles } from "@styles/styles";
import { useState } from "react";


const ViewBuildMode: React.FC<IViewQuestion> = ({ question }) => {
    return <div>
        {question.choices?.map((choice, index) => (

            <div className="flex items-center space-x-2 my-3" key={`${question.id}-${index}`}>

                <input type="checkbox"
                    name={question.id}
                    value={choice.value}
                    className={styles.radio}
                />

                <label

                    className={styles.radioLabel}
                >
                    {choice.label}
                </label>



            </div>
        ))}

    </div>
}

const ViewFullMode: React.FC<IViewQuestion> = ({ question }) => {
    const [checkedValues, setCheckedValues] = useState<string[]>([])

    const handleCheckSelection = (value: string, checked: boolean) => {
        setCheckedValues((prevValues) => {
            const currentValues = [...prevValues];
            const existingIndex = currentValues.indexOf(value);
    
            if (checked && existingIndex === -1) {
                currentValues.push(value);
            } else if (!checked && existingIndex > -1) {
                currentValues.splice(existingIndex, 1);
            }
    
            handleChange(currentValues.join(","));
            return currentValues;
        });
    };

    const {
        validationMessage,
        handleChange
    } = useHandleAnswering(question)



    return (<div className="flex flex-col">
        {question.choices?.map((choice, index) => (

            <div className="flex items-center space-x-2 my-3" key={`${question.id}-${index}`}>

                <input type="checkbox"
                    name={question.id}
                    value={choice.value}
                    checked={checkedValues.indexOf(choice.value) > -1 ? true : false}
                    onChange={(e)=>handleCheckSelection(e.target.value, e.target.checked)}
                    className={styles.radio}
                    
                />

                <label

                    className={styles.radioLabel}
                >
                    {choice.label}
                </label>



            </div>

        ))}

        <ErrorMessage message={validationMessage} />

    </div>
    )

}

const PreviewCheckboxQuestion: React.FC<IPreviewQuestionProps> = ({ question, isViewMode }) => {
    if (!isViewMode) return <ViewBuildMode question={question} />
    return <ViewFullMode question={question} />;
}

export default PreviewCheckboxQuestion;