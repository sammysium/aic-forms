
import './App.css';
import FormBuilder from '@ui/FormBuilder'
import { AppContextProvider } from '@contexts/AppContext';
import { AnswerContextProvider } from '@contexts/AnswerContext';

function App() {
  return (
    <div>
      <AppContextProvider>

      <AnswerContextProvider>
      <FormBuilder saveForm={()=>console.log("done")}/>
      </AnswerContextProvider>
      </AppContextProvider>

      
    </div>
  );
}

export default App;
