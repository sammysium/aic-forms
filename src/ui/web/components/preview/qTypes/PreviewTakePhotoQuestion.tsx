

import useHandleAnswering from "@hooks/useHandleAnswering";
import { IPreviewQuestionProps, IViewQuestion } from "@interfaces/appInterface";

import ErrorMessage from "../ErrorMessage";
import { Button } from "@/components/ui/button";
import CaptureMedia from "../../shared/CaptureMedia";


const ViewBuildMode: React.FC<IViewQuestion> = ({ question }) => {
    return <Button variant="readyActionSmall" >Take Photo</Button>
}
const ViewFullMode: React.FC<IViewQuestion> = ({ question }) => {

    const {
        validationMessage,
        handleChange

    } = useHandleAnswering(question)


    const handleTakenPhoto = (src: string) => {

        handleChange(src)
    }


    return (<div>
        <CaptureMedia takePhoto handleTakenPhoto={handleTakenPhoto} />

        <ErrorMessage message={validationMessage} />
    </div>
    )

}


const PreviewTakePhotoQuestion: React.FC<IPreviewQuestionProps> = ({ question, isViewMode }) => {
    if (!isViewMode) return <ViewBuildMode question={question} />
    return <ViewFullMode question={question} />
};

export default PreviewTakePhotoQuestion;