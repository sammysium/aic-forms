import { IPreviewQuestionProps, IViewQuestion } from "@interfaces/appInterface";
import ErrorMessage from "../ErrorMessage";
import useHandleAnswering from "@hooks/useHandleAnswering";


const ViewBuildMode: React.FC<IViewQuestion> = ({ question }) => {
    return <pre>{question.textContent}</pre>;
}

const ViewFullMode: React.FC<IViewQuestion> = ({ question }) => {
   
    const {
        validationMessage,
      
        value,
   
      
        handleChange

    } = useHandleAnswering(question)



        return (<div className="flex flex-col gap-5">
            <pre>{question.textContent}</pre>
            <div className="flex gap-5">
            <input type="checkbox" 
        
        checked={value === "true" ? true: false} 
        value={value  === "true" ? "checked": ""}    
        className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
        onChange={(e) => handleChange(e.target.checked ? "true": "")}  
      />  I agree to terms and conditions
            </div>
          
            <ErrorMessage message={validationMessage} />
        </div>
        )

}

const PreviewTermsAndConditionsQuestion: React.FC<IPreviewQuestionProps> = ({ question, isViewMode }) => {
    if (!isViewMode) return <ViewBuildMode question={question} />
    return <ViewFullMode question={question} />;

}

export default PreviewTermsAndConditionsQuestion;