

import useHandleAnswering from "@hooks/useHandleAnswering";
import { IPreviewQuestionProps, IViewQuestion } from "@interfaces/appInterface";

import ErrorMessage from "../ErrorMessage";
import { Button } from "@/components/ui/button";
import CaptureMedia from "../../shared/CaptureMedia";


const ViewBuildMode: React.FC<IViewQuestion> = ({ question }) => {
    return <Button variant="readyActionSmall" >Shoot Video</Button>
}
const ViewFullMode: React.FC<IViewQuestion> = ({ question }) => {

    const {
        validationMessage,
        handleChange

    } = useHandleAnswering(question)


    const hanleShotVideo = (src: string) => {

        handleChange(src)
    }


    return (<div>
        <CaptureMedia takePhoto={false} hanleShotVideo={hanleShotVideo} />

        <ErrorMessage message={validationMessage} />
    </div>
    )

}


const PreviewTakeVideoQuestion: React.FC<IPreviewQuestionProps> = ({ question, isViewMode }) => {
    if (!isViewMode) return <ViewBuildMode question={question} />
    return <ViewFullMode question={question} />
};

export default PreviewTakeVideoQuestion;