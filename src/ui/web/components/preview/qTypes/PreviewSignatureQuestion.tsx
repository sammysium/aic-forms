import { IPreviewQuestionProps, IViewQuestion } from "@interfaces/appInterface";
import { useRef } from "react";
import SignaturePad from "react-signature-pad-wrapper";
import ErrorMessage from "../ErrorMessage";
import useHandleAnswering from "@hooks/useHandleAnswering";
import { Button } from "@/components/ui/button";

const padOptions = {
  width: 200,
  height: 200
}

const ViewBuildMode: React.FC<{}> = () => {
  return <SignaturePad       
      width={padOptions.width}
      height={padOptions.height}
      />;
}

const ViewFullMode: React.FC<IViewQuestion> = ({ question }) => {
  const {
    validationMessage,
    handleChange

  } = useHandleAnswering(question)
  const signaturePadRef = useRef<any>(null)

  const clearSignature = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
    }
  }

  const saveSignature = () => {
    if (signaturePadRef.current) {
      const canvas = signaturePadRef.current;
      const dataURL = canvas.toDataURL();
      handleChange(dataURL)
    }
  }

  return (<div className="flex flex-col space-y-3.5 > * + *">

    <SignaturePad
      redrawOnResize
      ref={signaturePadRef}
      width={padOptions.width}
      height={padOptions.height}
      canvasProps={{
        className: 'border border-solid border-black w-80 h-52',
      }}
    />

    <div className="flex justify-center">
      <Button onClick={saveSignature} variant="readyActionSmall">
        Save Signature
      </Button>
      <Button onClick={clearSignature} variant="readyActionSmall">
        Clear Signature
      </Button>
    </div>


    <ErrorMessage message={validationMessage} />
  </div>
  )




}


const PreviewSignatureQuestion: React.FC<IPreviewQuestionProps> = ({ question, isViewMode }) => {
  if (!isViewMode) return <ViewBuildMode />
  return <ViewFullMode question={question} />
};

export default PreviewSignatureQuestion;