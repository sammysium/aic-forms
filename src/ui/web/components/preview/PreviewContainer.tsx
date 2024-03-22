import { EUIType, Section, SubSection, Question } from "@interfaces/appInterface";
import isEmpty from "validator/lib/isEmpty"
import RecordActionRow from "../shared/RecordActionRow";
import { useState } from "react";
import { IActiveRecord } from "@contexts/AppContext";
import { styles } from "@styles/styles";
import Draggable from "../shared/Draggable";
import Droppable from "../shared/Droppable";
import PreviewQuestion from "./PreviewQuestion";
import { shouldSkipMe, shouldRenderXTimes } from "@utils/showSkipChecks";
import { IAnswer } from "@contexts/reducers/formConsumerReducer";

// todo: think about pros and cons of having separate iprops for secton and subsection
// both are similar...just section contains a section.

interface IPreviewSection {
    questionnaireContent: Section[],
    currentAnswers: IAnswer[],
    section: Section,
    isViewMode: boolean,
    activeRecord?: IActiveRecord,
    handleEditContainerData?: (id: string, containerType: EUIType) => void,
    handleDeleteContainerData?: (id: string, containerType: EUIType) => void,
    handleQuestionDeletion?: (id: string) => void,
    handleQuestionEdit?: (question: Question) => void
}

interface IPreviewSubSection {
    questionnaireContent: Section[],
    currentAnswers: IAnswer[],
    subSection: SubSection,
    isViewMode: boolean,
    activeRecord?: IActiveRecord,
    handleEditContainerData?: (id: string, containerType: EUIType) => void,
    handleDeleteContainerData?: (id: string, containerType: EUIType) => void,
    handleQuestionDeletion?: (id: string) => void,
    handleQuestionEdit?: (question: Question) => void
}

interface IPreviewContainerData {
    data: Section | SubSection;
    isViewMode: boolean;
    children: React.ReactNode,
    activeRecord?: IActiveRecord,
    handleEditRequest?: (id: string) => void,
    handleDeleteRequest?: (id: string) => void,
    euiType: EUIType
}

const PreviewContainerData: React.FC<IPreviewContainerData> = ({ data, euiType, handleEditRequest, handleDeleteRequest, activeRecord, isViewMode, children }) => {
    const [isExpanded, setIsExpanded] = useState(true)
    const borderStyle = activeRecord !== undefined && (activeRecord.sectionId === data.id || activeRecord.subSectionId === data.id) ? styles.activeContainer : styles.inActiveContainer;
    const containerStyle = `w-full ${borderStyle}  mt-2 flex flex-col`

    const { id, label, description } = data;

    return (
        <Droppable viewMode={isViewMode} id={id} accepts={[EUIType.Question, EUIType.Section, EUIType.SubSection]}>
            <Draggable viewMode={isViewMode} id={id} type={euiType} data={data}>
                <div className={containerStyle}>
                    <div className="w-full bg-gray-200 h-[200] flex flex-row justify-between px-3 py-3 mb-4">
                        <div>{label}</div>
                        <div>
                            <RecordActionRow isViewMode={isViewMode} id={id}
                                handleDeleteRequest={(deleteId) => handleDeleteRequest && handleDeleteRequest(deleteId)}
                                handleEditRequest={(editId) => handleEditRequest && handleEditRequest(editId)}
                                isExpanded={isExpanded}
                                setIsExpanded={setIsExpanded}
                            />
                        </div>
                    </div>
                    {isExpanded && (<div>
                        {description && !isEmpty(description ?? "") && (<><div className="py-3 px-4" dangerouslySetInnerHTML={{ __html: description }} /><hr /></>)}

                        <div className="px-4 py-2">
                            {children}
                        </div>
                    </div>)}

                </div>
            </Draggable>
        </Droppable>
    )
}

export const PreviewSection: React.FC<IPreviewSection> = ({
    questionnaireContent,
    currentAnswers,
    section, isViewMode, activeRecord, handleEditContainerData, handleDeleteContainerData, handleQuestionDeletion, handleQuestionEdit }) => {
    const sectionContent = section.content;

    return (<PreviewContainerData
        data={section}
        euiType={EUIType.Section}
        handleEditRequest={() => handleEditContainerData && handleEditContainerData(section.id, EUIType.Section)}
        handleDeleteRequest={(id) => handleDeleteContainerData && handleDeleteContainerData(id, EUIType.Section)}
        activeRecord={activeRecord} isViewMode={isViewMode} key={section.id}>
        {sectionContent.map(content => {
            if (content.euiType === EUIType.SubSection) {
                const subSection = content as SubSection
                const shouldSkip = shouldSkipMe(subSection.skipLogic, currentAnswers, questionnaireContent, isViewMode)
                if (shouldSkip ) return null;

                const previewSubSection : JSX.Element = <PreviewSubSection
                    currentAnswers={currentAnswers}
                    questionnaireContent={questionnaireContent}
                    handleDeleteContainerData={(id) => handleDeleteContainerData && handleDeleteContainerData(id, EUIType.SubSection)}
                    handleEditContainerData={handleEditContainerData} key={subSection.id} subSection={subSection} activeRecord={activeRecord} isViewMode={isViewMode} handleQuestionDeletion={handleQuestionDeletion} handleQuestionEdit={handleQuestionEdit} />
                  
                    const showXTimes = shouldRenderXTimes(currentAnswers, questionnaireContent, isViewMode, previewSubSection, subSection.id, subSection.showLogic)

                    return <>{showXTimes}</>
                }
            const question = content as Question
            const shouldSkip = shouldSkipMe(question.skipLogic, currentAnswers, questionnaireContent, isViewMode)
            if (shouldSkip) return null
            return <PreviewQuestion questionnaireContent={questionnaireContent} key={question.id} question={question} isViewMode={isViewMode} 
            handleQuestionDeletion={()=>handleQuestionDeletion && handleQuestionDeletion(question.id)} 
            handleQuestionEdit={()=>handleQuestionEdit &&  handleQuestionEdit(question)}/>

        })}
    </PreviewContainerData>)


}

const PreviewSubSection: React.FC<IPreviewSubSection> = ({ currentAnswers, questionnaireContent, subSection, handleDeleteContainerData, activeRecord, isViewMode, handleEditContainerData, handleQuestionDeletion, handleQuestionEdit }) => {
    const questions = subSection.questions
    return (
        <PreviewContainerData
            data={subSection}
            euiType={EUIType.SubSection}
            handleDeleteRequest={(id) => handleDeleteContainerData && handleDeleteContainerData(id, EUIType.SubSection)}
            handleEditRequest={(id) => handleEditContainerData && handleEditContainerData(id, EUIType.SubSection)} activeRecord={activeRecord} isViewMode={isViewMode} key={subSection.id}>
            {questions.map(question => {
                const shouldSkip = shouldSkipMe(question.skipLogic, currentAnswers, questionnaireContent, isViewMode)
                if (shouldSkip) return null
                return <PreviewQuestion questionnaireContent={questionnaireContent} key={question.id} question={question} isViewMode={isViewMode} 
                handleQuestionDeletion={() => handleQuestionDeletion && handleQuestionDeletion(question.id)} 
                handleQuestionEdit={()=>handleQuestionEdit && handleQuestionEdit(question)} />
            })}
        </PreviewContainerData>
    )
}
