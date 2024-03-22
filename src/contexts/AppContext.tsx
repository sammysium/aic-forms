import { Section } from "@interfaces/appInterface";
import { createContext, useMemo, useReducer } from "react";
import { FBActions, fbReducer } from "@contexts/reducers/fbReducer";

export interface IActiveRecord {
  sectionIndex: number,
  subSectionIndex: number,
  questionIndex: number,
  sectionId: string,
  subSectionId: string,
  questionId: string
}

export interface IAppContext {
  content: Section[],
  activeRecord: IActiveRecord,
  inViewMode: boolean,
  dispatch: React.Dispatch<FBActions>
}



export const AppContext = createContext<IAppContext | null>(null);


interface IProps {
  children: React.ReactNode
}


export const AppContextProvider: React.FC<IProps> = ({ children }) => {


  const initialActiveRecord: IActiveRecord = {
    sectionIndex: -1,
    questionIndex: -1,
    subSectionIndex: -1,
    sectionId: "",
    subSectionId: "",
    questionId: ""
  }

  const [state, dispatch] = useReducer(fbReducer, {
    activeRecord: initialActiveRecord,
    inViewMode: false,
    content: []
  })

  const contextValue = useMemo(
    () => ({ content: state.content, activeRecord: state.activeRecord, inViewMode: state.inViewMode, dispatch }),
    [state.content, state.activeRecord, state.inViewMode, dispatch]
  );

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>

}