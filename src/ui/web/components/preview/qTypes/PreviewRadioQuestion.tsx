import { IPreviewQuestionProps, IViewQuestion } from "@interfaces/appInterface";
import ErrorMessage from "../ErrorMessage";
import useHandleAnswering from "@hooks/useHandleAnswering";
import { styles } from "@styles/styles";


const ViewBuildMode: React.FC<IViewQuestion> = ({ question }) => {
    return <div>
        {question.choices?.map((choice, index) => (

            <div className="flex items-center space-x-2 my-3" key={`${question.id}-${index}`}>

                <input type="radio"
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

    const {
        validationMessage,

        value,


        handleChange

    } = useHandleAnswering(question)



    return (<>
        {question.choices?.map((choice, index) => (

            <div className="flex items-center space-x-2 my-3" key={`${question.id}-${index}`}>

                <input type="radio"
                    name={question.id}
                    value={choice.value}
                    checked={value === choice.value}
                    className={styles.radio}
                    onChange={(e) => handleChange(e.target.value)}
                />

                <label

                    className={styles.radioLabel}
                >
                    {choice.label}
                </label>



            </div>

        ))}

        <ErrorMessage message={validationMessage} />

    </>
    )

}

const PreviewRadioQuestion: React.FC<IPreviewQuestionProps> = ({ question, isViewMode }) => {
    if (!isViewMode) return <ViewBuildMode question={question} />
    return <ViewFullMode question={question} />;
}

export default PreviewRadioQuestion;