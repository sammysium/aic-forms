import { currencyList } from "@data/currency";
import { ICurrencyDetail, IPreviewQuestionProps, IViewQuestion } from "@interfaces/appInterface";
import QuestionPrefixSuffix from "../../shared/QuestionPrefixSuffix";
import { Input } from "@/components/ui/input";
import ErrorMessage from "../ErrorMessage";
import useHandleAnswering from "@hooks/useHandleAnswering";

interface IProps {
    currencyInfo: ICurrencyDetail
}


const ViewBuildMode: React.FC<IProps> = ({ currencyInfo}) => {
        return <QuestionPrefixSuffix prefix={currencyInfo.symbol} suffix={currencyInfo.code}>
            <Input />
        </QuestionPrefixSuffix>
}

const ViewFullMode: React.FC<IViewQuestion> = ({ question }) => {

    const {
        validationMessage,
        value,
        handleChange
    } = useHandleAnswering(question)

    return (
       <div>
        <Input onChange={(e)=>handleChange(e.target.value)} value={value} />
        
        <ErrorMessage message={validationMessage} />
    </div>
    )
}


const PreviewCurrencyQuestion: React.FC<IPreviewQuestionProps> = ({ question, isViewMode }) => {

    const currencyInfo : ICurrencyDetail = {
        symbol: currencyList[0].symbol,
        code: currencyList[0].code,
        name: ""
    }

     if (!isViewMode) return <ViewBuildMode currencyInfo={currencyInfo} />
    return <ViewFullMode question={question} />
}

export default PreviewCurrencyQuestion;