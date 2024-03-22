import { Button } from "@/components/ui/button";
import { EUIType, IEditSecSubSection, IFindRecords, IPropsFromBuilder, Question, QuestionType, Section, SubSection } from "@interfaces/appInterface";
import { MdFolderOpen, MdOutlineFileCopy } from "react-icons/md";
import { groupedActionButtons } from "@ui/components/ActionButtons";
import { useContext, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SectionSubEditor from "@ui/components/builders/SectionSubEditor";
import Modal from "@ui/components/builders/containers/Modal";
import { IAppContext, AppContext } from "@contexts/AppContext";
import FormConsumer from "./FormConsumer";
import { findContentById, questionIsPure } from "@utils/search";
import { DndContext, useSensor, useSensors } from '@dnd-kit/core';
import { KeyboardSensor, MouseSensor, TouchSensor } from "@ui/components/shared/DraggablePointerSensor";
import { QuestionLayout } from "@ui/components/builders/containers/QuestionLayout";
import { IAnswer } from "@contexts/reducers/formConsumerReducer";



const initialSubSectionValues: IEditSecSubSection = {
    id: "",
    label: "",
    description: "",
    skipLogic: [],
    showLogic: undefined
}

const FormBuilder: React.FC<IPropsFromBuilder> = ({ saveForm }) => {
    const { activeRecord, content, dispatch, inViewMode } = useContext(AppContext) as IAppContext;

    const [activeButtonGroup, setActiveButtonGroup] = useState("")
    const [openModal, setOpenModal] = useState(false)

    const [editorDetails, setEditorDetails] = useState<{
        wantedQuestionnaireComponent: string,
        title: string,
        editQuestion?: Question,
        isSection?: boolean,
        prePopulateSecSubSection: IEditSecSubSection,
        questionType?: QuestionType

    }>({
        wantedQuestionnaireComponent: "", title: "",
        editQuestion: undefined, isSection: undefined,
        prePopulateSecSubSection: initialSubSectionValues,
        questionType: undefined
    })

    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 10, // dragging 10px 
        },
    })
    const keyboardSensor = useSensor(KeyboardSensor)
    const touchSensor = useSensor(TouchSensor)
    const sensors = useSensors(mouseSensor, keyboardSensor, touchSensor)

    const resetPopulatedValues = () => {
        setEditorDetails({
            prePopulateSecSubSection: initialSubSectionValues,
            wantedQuestionnaireComponent: "",
            title: "",
            isSection: undefined,
            editQuestion: undefined
        })

        setOpenModal(false)
    }

    const handleFormSubmission = (answers: IAnswer[]) => {
        console.log(answers)
    }


    const renderQuestionTypeButtons = () => {
        let buttonPairs: JSX.Element[] = [];
        const buttonsPerRow = 2; // Number of buttons in a row

        const blocks: JSX.Element[] = [];

        let firstGroupLabel = ""

        Object.keys(groupedActionButtons).forEach(label => {
            firstGroupLabel = firstGroupLabel === "" ? label : firstGroupLabel
            buttonPairs = [];
            const actionButtons = groupedActionButtons[label]

            for (let i = 0; i < actionButtons.length; i += buttonsPerRow) {
                const buttonsInPair = actionButtons.slice(i, i + buttonsPerRow).map((button, index) => (

                    <Button
                        variant="readyActionSmall"
                        disabled={activeRecord.sectionIndex === -1}
                        key={`button-${label}-${i + index}`}
                        className='w-1/2 flex-1'
                        onClick={() => {
                            setEditorDetails({
                                title: button.label,
                                wantedQuestionnaireComponent: button.questionType,
                                isSection: undefined,
                                editQuestion: undefined,
                                prePopulateSecSubSection: initialSubSectionValues,
                                questionType: button.questionType
                            })
                            setOpenModal(true)

                        }}>
                        {<button.iconType className="mr-1" />}
                        {button.label}
                    </Button>



                ));

                buttonPairs.push(
                    <div key={`button-pair-${i}`} className="flex gap-2 mt-2">
                        {buttonsInPair}
                    </div>
                );

            }


            return blocks.push(<div className='my-2' key={label}>
                <Button variant={activeButtonGroup === label ? "readyActionButton" : "notReadyActionButton"} onClick={() => setActiveButtonGroup(label)}>{label}</Button>
                {activeButtonGroup === label && (<div>
                    {buttonPairs}
                </div>)}
            </div>)
        })

        if (activeButtonGroup === "") {
            setActiveButtonGroup(firstGroupLabel)
        }
        return blocks;
    };


    const handleEditContainerData = (id: string, containerType: EUIType) => {
        // user wants to edit a section or a sub section. note this is not content;
        // just label etc that describe the container.
        // get the section to be edited and load it up
        if (inViewMode) return;
        const result: IFindRecords = findContentById(content, id)
        if (
            (containerType === EUIType.Section && result.sectionIndex === -1) ||
            (containerType === EUIType.SubSection && result.subSectionIndex === -1)) {
            return;
        }

        // note section and subsection have overlapping information...
        const section = result.record as Section
        const isSection = containerType === EUIType.Section ? true : false
        setEditorDetails({
            editQuestion: undefined,
            isSection,
            prePopulateSecSubSection: {
                label: section.label,
                description: section.description,
                skipLogic: section.skipLogic,
                showLogic: section.showLogic,
                id: section.id
            },
            wantedQuestionnaireComponent: EUIType.Section,
            title: isSection ? "Section" : "Sub Section",
            questionType: undefined
        })


        setOpenModal(true)
    }

    const handleQuestionDeletion = (questionId: string) => {
        if (!questionIsPure(content, questionId)) {
            alert('The question is used in logics')
            return;
        }
    
        dispatch({ type: 'DELETE_QUESTION', payload: questionId })
    }

    const handleQuestionEdit = (question: Question) => {
       
            setEditorDetails({
                editQuestion: question,
                isSection: false,
                prePopulateSecSubSection: initialSubSectionValues,
                wantedQuestionnaireComponent: EUIType.Question,
                title: "Edit Question",
                questionType: question.type
            })

            setOpenModal(true)
        
    }

    const handleDeleteContainerData = (id: string, containerType: EUIType) => {
        if (inViewMode) return;
        const result: IFindRecords = findContentById(content, id)
        if (
            (containerType === EUIType.Section && result.sectionIndex === -1) ||
            (containerType === EUIType.SubSection && result.subSectionIndex === -1)) {
            return;
        }


        if (containerType === EUIType.Section) {
            const section = result.record as Section
            dispatch({ type: 'DELETE_SECTION', payload: section })
        } else if (containerType === EUIType.SubSection) {
            const subSection = result.record as SubSection;
            dispatch({ type: 'DELETE_SUB_SECTION', payload: subSection })
        }
    }

    const setViewMode = (wantedView: boolean) => {
        dispatch({ type: 'SET_VIEW_MODE', payload: wantedView })
    }

    function handleDragEnd(ev: any) {
        // What to do here??
        // It's not a sortable, it's a free drag and drop

        // make sure we are not dropped it to a non-droppable.
        if (ev["over"] === null) return;
        const draggedItemId = ev.active.id;
        const draggedItemType = ev.active.data.current.type;
        const droppedToItemId = ev.over.id;

        dispatch({
            type: "HANDLE_DND", payload: {
                draggedItemId,
                droppedToItemId,
                draggedItemType
            }
        })
    }

    const saveQuestion = (question: Question, isNew: boolean) => {
        if (isNew) {
            dispatch({ type: 'ADD_NEW_QUESTION', payload: question })
        }

        resetPopulatedValues()

    }


    return <div className="h-screen flex bg-white">

        {!inViewMode && (<div className="bg-white w-1/4 sm:w-72 flex flex-col justify-between overflow-y-auto"> {/* Left column with a fixed width of 250px */}
            <div>
                <h1 className="p-4 text-gray-400 font-semibold text-xl">Form Builder</h1>

                <div className="flex flex-col p-4">

                    <div className="flex mt-2 mb-5">
                        <Button
                            variant="readyActionButton"
                            onClick={() => {
                                setEditorDetails({
                                    title: "Section",
                                    wantedQuestionnaireComponent: EUIType.Section,
                                    isSection: true,
                                    prePopulateSecSubSection: initialSubSectionValues,
                                    editQuestion: undefined,
                                    questionType: undefined

                                })
                                setOpenModal(true)
                            }}
                        >
                            <MdFolderOpen />
                            Section
                        </Button>

                        <Button
                            disabled={activeRecord.sectionIndex === -1}
                            variant="readyActionButton"
                            onClick={() => {

                                setEditorDetails({
                                    title: " Sub Section",
                                    wantedQuestionnaireComponent: EUIType.SubSection,
                                    isSection: false,
                                    prePopulateSecSubSection: initialSubSectionValues,
                                    editQuestion: undefined,
                                    questionType: undefined

                                })
                                setOpenModal(true)
                            }}>

                            <MdOutlineFileCopy />
                            Sub Section
                        </Button>




                    </div>

                    <hr />

                    {
                        renderQuestionTypeButtons()
                    }


                </div>


            </div>
            <div className="mb-4"> {/* Stack Save Questionnaire button at the bottom */}

                <Button variant="readyActionButton">Save Form</Button>

            </div>
        </div>)}

        <div className="flex bg-gray-100 overflow-scroll w-full mt-2"> {/* Right column occupying the remaining width */}
            <div className="w-full px-3">
                <Tabs defaultValue="build" className="w-full">
                <div className="border border-b-4 border-gray-900 sticky top-0">
        <TabsList>
          <TabsTrigger value="build" onClick={() => setViewMode(false)}>
            Build Mode
          </TabsTrigger>
          <TabsTrigger value="view" onClick={() => setViewMode(true)}>
            View Mode
          </TabsTrigger>
        </TabsList>
      </div>
                    <div className="flex flex-col h-screen">
                        <TabsContent value="build">
                            <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
                                <FormConsumer
                                    handleFormSubmission={(result: IAnswer[]) => console.log(result)}
                                    handleQuestionDeletion={(id: string) => handleQuestionDeletion(id)}
                                    handleQuestionEdit={(question: Question)=>handleQuestionEdit(question)}
                                    handleDeleteContainerData={(id: string, containerType: EUIType) => handleDeleteContainerData(id, containerType)}
                                    handleEditContainerData={(id: string, containerType: EUIType) => handleEditContainerData(id, containerType)}
                                    content={content} activeRecord={activeRecord} isViewMode={false} />
                            </DndContext>

                        </TabsContent>


                        <TabsContent value="view">
                           <FormConsumer
                                    handleFormSubmission={handleFormSubmission}
                                    handleQuestionEdit={(question: Question) => console.log(question)}
                                    handleQuestionDeletion={(id: string) => console.log(id)}
                                    handleDeleteContainerData={(id: string, containerType: EUIType) => console.log(id, containerType)}
                                    handleEditContainerData={(id: string, containerType: EUIType) => console.log(id, containerType)}
                                    content={content} activeRecord={activeRecord} isViewMode />
                        </TabsContent>
                    </div>
                </Tabs>


            </div>
        </div>

        <Modal isOpen={openModal} onClose={resetPopulatedValues} title={editorDetails.title}>

            {(editorDetails.wantedQuestionnaireComponent === "section" || editorDetails.wantedQuestionnaireComponent === "subSection")
                && (<SectionSubEditor
                    editExistingContent={editorDetails.prePopulateSecSubSection}
                    isSection={editorDetails.isSection as boolean} onSave={resetPopulatedValues} />)
            }

            {editorDetails.questionType !== undefined
                && (<QuestionLayout
                    editQuestion={editorDetails.editQuestion}
                    questionType={editorDetails.questionType}
                    saveQuestion={(question: Question, isNew: boolean) => saveQuestion(question, isNew)}
                />)
            }






        </Modal>
    </div>
}

export default FormBuilder;