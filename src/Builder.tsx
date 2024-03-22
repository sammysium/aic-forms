
import './App.css';

import { AppContextProvider } from "@contexts/AppContext";
import { AnswerContextProvider } from "@contexts/AnswerContext";
import FormBuilder from '@ui/FormBuilder';
import { IPropsFromBuilder } from '@interfaces/appInterface';

const  Builder : React.FC<IPropsFromBuilder> = ({saveForm}) => {
  return (
    <div className="App">
      <AppContextProvider>
      <AnswerContextProvider>
      <FormBuilder saveForm={saveForm}/>
      </AnswerContextProvider>
      </AppContextProvider>
    </div>
  );
}

export default Builder;
