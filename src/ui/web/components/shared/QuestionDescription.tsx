import { styles } from "@styles/styles";
import isEmpty from "validator/lib/isEmpty"

interface IProps {
    description?: string
}

const QuestionDescription : React.FC<IProps> = ({description}) => {
    if (!description || (description && isEmpty(description))) return null;
    return <div className={styles.questions.description}>{description}</div>
}

export default QuestionDescription;