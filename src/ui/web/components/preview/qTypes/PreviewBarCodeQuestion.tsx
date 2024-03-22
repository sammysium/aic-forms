
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useState } from "react";
import { IPreviewQuestionProps, IViewQuestion } from "@interfaces/appInterface";
import ErrorMessage from "../ErrorMessage";
import useHandleAnswering from "@hooks/useHandleAnswering";
import { Textarea } from '@/components/ui/textarea';


const ViewBuildMode: React.FC<{}> = () => {
    return <Textarea readOnly placeholder='Code Reader' />;
  }
  
  const ViewFullMode: React.FC<IViewQuestion> = ({ question }) => {
    const [result, setResult] = useState("")
    const {
      validationMessage,
      handleChange
  
    } = useHandleAnswering(question)

    const readCode = () => {
        const scanner = new Html5QrcodeScanner("reader", {
            qrbox: {
                width: 140,
                height: 140
            },
            fps: 5,
            
    
        },
        true
        
        )
        scanner.render(success, fail);

        function success(res: string) {
            setResult(res)
            handleChange(res);
            scanner.clear();
        }
        function fail(err: any) {
            console.log(err)
        }
    }
    
  
    return (<div className='flex flex-col'>
        <div id="reader" className='w-[750px] h-[250px]'></div>
  
      <div>
        <button onClick={readCode} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">
          Read
        </button>
      </div>
  
      <ErrorMessage message={validationMessage} />
    </div>
    )
  
  
  
  
  }
  
  
  const PreviewBarCodeQuestion: React.FC<IPreviewQuestionProps> = ({ question, isViewMode }) => {
    if (!isViewMode) return <ViewBuildMode />
    return <ViewFullMode question={question} />
  };
  
  export default PreviewBarCodeQuestion;