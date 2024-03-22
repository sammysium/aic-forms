import React, { useContext, useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"




import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { styles } from "@styles/styles";
import RichTextEditor from '../shared/RichTextEditor';
import { EUIType, IEditSecSubSection, IShowSkipLogicCondition, Section, SubSection } from "@interfaces/appInterface";
import SkipLogicComponent from '../shared/SkipLogic';
import ShowLogic from '../shared/ShowLogic';
import { AppContext, IAppContext } from "@contexts/AppContext";
import { generateId } from "@utils/utils";

interface SectionSubEditorProps {
    onSave: () => void;
    editExistingContent: IEditSecSubSection,
    isSection: boolean
}

const SectionSubEditor: React.FC<SectionSubEditorProps> = ({ isSection, onSave, editExistingContent }) => {
    const { dispatch, activeRecord } = useContext(AppContext) as IAppContext;

    const [title, setTitle] = useState(editExistingContent?.label ?? "");
    const [desc, setDesc] = useState(editExistingContent?.description ?? "");
    const [skipLogic, setSkipLogic] = useState<IShowSkipLogicCondition[]>(editExistingContent?.skipLogic ?? [])
    const [showLogic, setShowLogic] = useState<IShowSkipLogicCondition | undefined>(editExistingContent?.showLogic ?? undefined)


    const handleSave = () => {
        if (editExistingContent.id === "") {
            if (isSection) {
                const section: Section = {
                    id: generateId(),
                    euiType: EUIType.Section,
                    content: [],
                    label: title,
                    description: desc,
                    skipLogic,
                    showLogic
                }
                dispatch({ type: "CREATE_NEW_SECTION", payload: section });
            } else {
                if (activeRecord.sectionIndex === -1) {
                    alert('You must define a section first')
                    return false;
                }
                const subSection: SubSection = {
                    id: generateId(),
                    euiType: EUIType.SubSection,
                    questions: [],
                    label: title,
                    description: desc,
                    skipLogic,
                    showLogic
                }
                dispatch({ type: "CREATE_NEW_SUB_SECTION", payload: { subSection, intoSectionIndex: activeRecord.sectionIndex } })
            }
        } else {
            // update existing data
            if (isSection) {
                const section: Partial<Section> = {
                    id: editExistingContent.id,
                    label: title,
                    description: desc,
                    skipLogic,
                    showLogic
                }
                dispatch({ type: "UPDATE_SECTION", payload: section });

            } else {

                const subSection: Partial<SubSection> = {
                    id: editExistingContent.id,
                    label: title,
                    description: desc,
                    skipLogic,
                    showLogic

                }
                dispatch({ type: "UPDATE_SUB_SECTION", payload: {id: editExistingContent.id, subSection }})

            }
        }


        onSave();

    }

    const handleSkipLogic = (conditions: IShowSkipLogicCondition[]) => {
        setSkipLogic(conditions)
    }

    const handleShowLogic = (condition: IShowSkipLogicCondition | undefined) => {
        setShowLogic(condition)
    }


    return (<div className="container mx-auto px-4 overflow-y-auto min-h-400">
        <div className="flex">



            <Tabs defaultValue="information" className="w-full flex-grow">
                <TabsList>
                    <TabsTrigger value="information">Information</TabsTrigger>
                    <TabsTrigger value="skipLogic">Skip Logic</TabsTrigger>
                    <TabsTrigger value="showLogic">Show Logic</TabsTrigger>
                </TabsList>
                <TabsContent value="information">

                    <div className={styles.labelInputContainers.container}>
                        <Label htmlFor="title">Title</Label>
                        <Input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>

                    <div className={styles.labelInputContainers.container}>
                        <Label htmlFor="desc">Description</Label>
                        <RichTextEditor onChange={(value) => setDesc(value)} initialValue={desc} />
                    </div>


                </TabsContent>
                <TabsContent value="skipLogic"> <SkipLogicComponent onHandleSkipLogic={handleSkipLogic} currentConditions={editExistingContent ? editExistingContent.skipLogic : []} />
                </TabsContent>

                <TabsContent value="showLogic"><ShowLogic onHandleShowLogic={handleShowLogic} currentCondition={editExistingContent ? editExistingContent.showLogic : undefined} /></TabsContent>
            </Tabs>



        </div>

        <div className="w-4/6 mb-0 mt-5 border-t-1 border-gray-500 py-4">



            <Button variant="readyActionSmall" onClick={handleSave} className='w-[180px]'>Save</Button>

        </div>
    </div>

    );
};

export default SectionSubEditor;