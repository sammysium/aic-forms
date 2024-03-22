
import './App.css';

import { AnswerContextProvider } from "@contexts/AnswerContext";
import { IPropsFillFormMode } from '@interfaces/appInterface';
import { FillFormMode } from '@ui/FormConsumer';

const Consumer : React.FC<IPropsFillFormMode> = ({content, handleFormSubmission}) => {
  return (
    <div className="App">
      <AnswerContextProvider>
      <FillFormMode content={content} handleFormSubmission={handleFormSubmission} />
      </AnswerContextProvider>
    </div>
  );
}

export default Consumer;
