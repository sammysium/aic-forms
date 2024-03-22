
import { createContext, useMemo, useReducer } from "react";
import formConsumereducer, { FCActions, IAnswer } from "@contexts/reducers/formConsumerReducer";

export interface IAnswerAppContext {
  answers: IAnswer[],
  errorFulQuestionIDs: string[],
  dispatch: React.Dispatch<FCActions>
}

export const AnswerContext = createContext<IAnswerAppContext | null>(null);

interface IProps {
  children: React.ReactNode
}

export const AnswerContextProvider: React.FC<IProps> = ({ children }) => {


  const [state, dispatch] = useReducer(formConsumereducer, {
    answers: [],
    errorFulQuestionIDs: []
  })

  const contextValue = useMemo(
    () => ({ answers: state.answers, errorFulQuestionIDs: state.errorFulQuestionIDs,  dispatch }),
    [state.answers, state.errorFulQuestionIDs, dispatch]
  );

  return <AnswerContext.Provider value={contextValue}>{children}</AnswerContext.Provider>

}