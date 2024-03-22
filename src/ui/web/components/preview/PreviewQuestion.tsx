import { EUIType, Question, QuestionType, Section } from "@interfaces/appInterface";
import { styles } from "@styles/styles";
import GenericToolTip from "../shared/GenericToolTip";
import QuestionDescription from "../shared/QuestionDescription";
import { FaPen, FaTrash } from "react-icons/fa";
import QuestionPrefixSuffix from "../shared/QuestionPrefixSuffix";
import PreviewTextQuestion from "./qTypes/PreviewTextQuestion";
import PreviewMaskedQuestion from "./qTypes/PreviewMaskedQuestion";
import PreviewLocationQuestion from "./qTypes/PreviewLocationQuestion";
import PreviewTextAreaQuestion from "./qTypes/PreviewTextAreaQuestion";
import PreviewTermsAndConditionsQuestion from "./qTypes/PreviewTermsAndConditionsQuestion";
import PreviewRadioQuestion from "./qTypes/PreviewRadioQuestion";
import PreviewCheckboxQuestion from "./qTypes/PreviewCheckboxQuestion";
import PreviewDropDownQuestion from "./qTypes/PreviewDropDownQuestion";
import PreviewTakePhotoQuestion from "./qTypes/PreviewTakePhotoQuestion";
import PreviewTakeVideoQuestion from "./qTypes/PreviewTakeVideoQuestion";
import PreviewDateTimeQuestion from "./qTypes/PreviewDateTimeQuestion";
import PreviewSignatureQuestion from "./qTypes/PreviewSignatureQuestion";
import PreviewBarCodeQuestion from "./qTypes/PreviewBarCodeQuestion";
import PreviewCurrencyQuestion from "./qTypes/PreviewCurrencyQuestion";
import PreviewFileUploadQuestion from "./qTypes/PreviewFileUploadQuestion";
import PreviewSurveryQuestion from "./qTypes/PreviewSurveryQuestion";
import Droppable from "../shared/Droppable";
import Draggable from "../shared/Draggable";

interface IProps {
    question: Question,
    questionnaireContent: Section[],
    handleQuestionDeletion: (id: string) => void,
    handleQuestionEdit: (question: Question) => void,
    isViewMode: boolean
}

type IMapQuestionTypeToPreview = {
    [key in QuestionType]: JSX.Element;
};



const PreviewQuestion: React.FC<IProps> = ({ question, isViewMode, handleQuestionDeletion,handleQuestionEdit, questionnaireContent }) => {
    const mapQuestionTypeToPreview: IMapQuestionTypeToPreview = {
        [QuestionType.Text]: <PreviewTextQuestion question={question} isViewMode={isViewMode} />,
        [QuestionType.Number]: <PreviewTextQuestion question={question} isViewMode={isViewMode} questionnaireContent={questionnaireContent} />,
        [QuestionType.Email]: <PreviewTextQuestion question={question} isViewMode={isViewMode} />,
        [QuestionType.URL]: <PreviewTextQuestion question={question} isViewMode={isViewMode} />,
        [QuestionType.Phone]: <PreviewTextQuestion question={question} isViewMode={isViewMode} />,
        [QuestionType.Money]: <PreviewCurrencyQuestion question={question} isViewMode={isViewMode} />,
        [QuestionType.TextArea]: <PreviewTextAreaQuestion question={question} isViewMode={isViewMode} />,
        [QuestionType.DateTime]: <PreviewDateTimeQuestion question={question} isViewMode={isViewMode} />,
        [QuestionType.DropDown]: <PreviewDropDownQuestion question={question} isViewMode={isViewMode} />,
        [QuestionType.Radio]: <PreviewRadioQuestion question={question} isViewMode={isViewMode} />,
        [QuestionType.CheckBox]: <PreviewCheckboxQuestion question={question} isViewMode={isViewMode} />,
        [QuestionType.FileUpload]: <PreviewFileUploadQuestion question={question} isViewMode={isViewMode} />,
        [QuestionType.Survey]: <PreviewSurveryQuestion question={question} isViewMode={isViewMode} />,
        [QuestionType.CapturePhoto]: <PreviewTakePhotoQuestion question={question} isViewMode={isViewMode} />,
        [QuestionType.AreaMap]: <PreviewTextQuestion question={question} isViewMode={isViewMode} />,
        [QuestionType.Location]: <PreviewLocationQuestion question={question} isViewMode={isViewMode} />,
        [QuestionType.BarCode]: <PreviewBarCodeQuestion question={question} isViewMode={isViewMode} />,
        [QuestionType.Audio]: <PreviewTextQuestion question={question} isViewMode={isViewMode} />,
        [QuestionType.Video]: <PreviewTakeVideoQuestion question={question} isViewMode={isViewMode} />,
        [QuestionType.Signature]: <PreviewSignatureQuestion question={question} isViewMode={isViewMode} />,
        [QuestionType.QRCode]: <PreviewBarCodeQuestion question={question} isViewMode={isViewMode} />,
        [QuestionType.TermsAndConditions]: <PreviewTermsAndConditionsQuestion question={question} isViewMode={isViewMode} />,
    }

    return (<Droppable viewMode={isViewMode} id={question.id} accepts={[EUIType.Question, EUIType.SubSection]}>
        <Draggable viewMode={isViewMode} id={question.id} type={EUIType.Question} data={question}>
            <div className={styles.questions.container}>
                <div className={styles.questions.header}>
                    <div className={styles.questions.label}>{question.label}</div>
                    <GenericToolTip tip={question.tooltip} />
                </div>
                <div className={styles.questions.body}>
                    <QuestionPrefixSuffix
                        prefix={question.prefix}
                        suffix={question.suffix}
                    >
                        {question.mask === undefined && (
                            mapQuestionTypeToPreview[question.type]
                        )}
                        {question.mask !== undefined && (
                            <PreviewMaskedQuestion question={question} isViewMode={isViewMode} />
                        )}


                    </QuestionPrefixSuffix>
                </div>
                <QuestionDescription description={question.description} />
                {!isViewMode && (<div className={styles.questions.actionButtons}>
                    <FaTrash style={styles.questions.trashIcon} onClick={() => handleQuestionDeletion(question.id)} />
                    <FaPen onClick={()=> handleQuestionEdit(question)}/>
                </div>)}
            </div>
        </Draggable>
    </Droppable>
    )
}

export default PreviewQuestion;