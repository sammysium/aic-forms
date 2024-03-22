import { styles } from "@styles/styles";
import isEmpty from "validator/lib/isEmpty"

interface IProps {
    message: string
}

const ErrorMessage : React.FC<IProps> = ( { message }) => {
    if (isEmpty(message)) return null;
    return <div className={styles.errorMessage}>{message}</div>;
}

export default ErrorMessage;