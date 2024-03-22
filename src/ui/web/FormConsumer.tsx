import { Button } from "@/components/ui/button";
import { EUIType, IPropsFillFormMode, Question, Section } from "@interfaces/appInterface";


import { useContext, useState } from "react";

import { IActiveRecord } from "@contexts/AppContext";
import { PreviewSection } from "@ui/components/preview/PreviewContainer";
import { shouldSkipMe, shouldRenderXTimes } from "@utils/showSkipChecks";
import { AnswerContext, IAnswerAppContext } from "@contexts/AnswerContext";

import { IAnswer } from "@contexts/reducers/formConsumerReducer";

interface IProps {
    content: Section[],
    activeRecord: IActiveRecord,
    isViewMode: boolean,
    handleEditContainerData: (id: string, containerType: EUIType) => void,
    handleDeleteContainerData: (id: string, containerType: EUIType) => void,
    handleQuestionDeletion: (id: string) => void;
    handleQuestionEdit: (question: Question) => void;
    handleFormSubmission: (result: IAnswer[]) => void;
}




const BuildMode: React.FC<IProps> = ({ content, activeRecord, isViewMode, handleEditContainerData, handleDeleteContainerData, handleQuestionDeletion, handleQuestionEdit }) => {
    return (<div className="h-screen flex bg-white w-full flex-col">
        {content.map((section: Section, index: number) => {

            const sectionPreview = <PreviewSection
                key={section.id}
                currentAnswers={[]}
                questionnaireContent={content}
                handleDeleteContainerData={handleDeleteContainerData}
                handleEditContainerData={handleEditContainerData}
                handleQuestionDeletion={handleQuestionDeletion}
                handleQuestionEdit={handleQuestionEdit}
                section={section}
                isViewMode={isViewMode}
                activeRecord={activeRecord} />

            const showXTimes: JSX.Element[] = shouldRenderXTimes([], content, isViewMode, sectionPreview, section.id, section.showLogic)

            return (<div key={`${section.id}-container`}>{showXTimes}</div>)

        })}
    </div>)
}

export const FillFormMode: React.FC<IPropsFillFormMode> = ({ content, handleFormSubmission }) => {
    const totalSections = content.length;
    const [activeSection, setActiveSection] = useState<Section | null>(content.length > 0 ? content[0] : null)

    const [currentSection, setCurrentSection] = useState(0);
    const { answers, errorFulQuestionIDs } = useContext(AnswerContext) as IAnswerAppContext;
  

    const goToPreviousSection = () => {
        if (currentSection === 0) {
            return;
        }
        let counter = currentSection - 1;
        while (counter >= 0) {
            const skipPreviousSection = shouldSkipMe(
                content[counter].skipLogic,
                answers,
                content,
                true

            );
            if (!skipPreviousSection) {
                setActiveSection(content[counter]);
                setCurrentSection(counter);
                break;
            } else {
                counter--;
            }
        }
    };


    const goToNextSection = () => {
        if (currentSection === totalSections - 1) {
            handleFormSubmission(answers);
            return;
        }
        let counter = currentSection + 1
        while (counter <= totalSections - 1) {
            const skipNextSection = shouldSkipMe(
                content[counter].skipLogic,
                answers,
                content,
                true
            );
            if (!skipNextSection) {
                setActiveSection(content[counter])
                setCurrentSection(counter)
                break;
            } else {
                counter++
            }


        }

    };

    const renderNavigationButtons = () => {

        const disabled = errorFulQuestionIDs.length > 0


        if (content.length > 0) {
            return (<div className="flex justify-between px-4 mt-4 mb-3 bottom-0 left-0">

                <Button
                    disabled={currentSection === 0 || disabled}
                    onClick={goToPreviousSection}
                    variant="readyActionSmall"
                >
                    Previous
                </Button>

                <Button
                    disabled={disabled}
                    onClick={goToNextSection}
                    variant="readyActionSmall"
                >
                    {currentSection === content.length - 1 ? "Submit" : "Next"}
                </Button>


            </div>)
        } else {
            return null;
        }

    }

    if (activeSection === null) return null;

    const sectionPreview = <PreviewSection
        currentAnswers={answers}
        questionnaireContent={content}
        section={activeSection!!}
        isViewMode
    />
    const showXTimes: JSX.Element[] = shouldRenderXTimes(answers, content, true, sectionPreview, activeSection.id, activeSection.showLogic)

    return (<div className="h-screen flex bg-white w-full flex-col">

        <div>{showXTimes}</div>

        {renderNavigationButtons()}

    </div>)
}

const FormConsumer: React.FC<IProps> = ({ content, activeRecord, isViewMode, handleEditContainerData, handleDeleteContainerData, handleQuestionDeletion, handleQuestionEdit, handleFormSubmission }) => {

    if (!isViewMode) {
        return <BuildMode
            handleFormSubmission={handleFormSubmission}
            content={content}
            activeRecord={activeRecord}
            isViewMode={isViewMode}
            handleDeleteContainerData={handleDeleteContainerData}
            handleEditContainerData={handleEditContainerData}
            handleQuestionDeletion={handleQuestionDeletion}
            handleQuestionEdit={handleQuestionEdit}
        />
    }



    return (<div className="h-screen flex bg-white w-full flex-col">
        <FillFormMode content={content} handleFormSubmission={handleFormSubmission} />
    </div>)
}

export default FormConsumer;