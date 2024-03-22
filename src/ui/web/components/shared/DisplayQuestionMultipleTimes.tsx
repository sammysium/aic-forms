import { Button } from "@/components/ui/button";
import { useState } from "react";
import { styles } from "@styles/styles";
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input";
import { Question } from "@interfaces/appInterface";
import QuestionPrefixSuffix from "./QuestionPrefixSuffix";
import PreviewMaskedQuestion from "../preview/qTypes/PreviewMaskedQuestion";
import { FaTrash } from "react-icons/fa";

interface IProps {
    question: Question;
    maxNumberToShow: number;
    children: React.ReactNode;
    handleMultipleAnswers: () => void;
    handleRemoveAnswer: (index: number) => void;
    handleUpdateAnswer: (index: number, newValue: string) => void;
    existingCSVAnswers: string[];

}

const DisplayQuestionMultipleTimes: React.FC<IProps> = ({ question, handleUpdateAnswer, handleRemoveAnswer, maxNumberToShow, children, handleMultipleAnswers, existingCSVAnswers }) => {
    const [totalAddedAlready, setTotalAddedAlready] = useState(existingCSVAnswers.length)

    const removeAnswer = (index: number) => {
        setTotalAddedAlready(totalAddedAlready - 1)
        handleRemoveAnswer(index)
    }

    const addAnotherUI = () => {
        setTotalAddedAlready(totalAddedAlready + 1)
        handleMultipleAnswers();
    }

    return (<>

        <Table>


            <TableBody>
                {existingCSVAnswers.map((answer, index) => (
                    <TableRow key={`${question.id}-${answer}`}>
                        <TableCell className="font-medium">
                            <QuestionPrefixSuffix
                                prefix={question.prefix}
                                suffix={question.suffix}
                            >
                                {question.mask === undefined && (
                                    <Input value={answer} onChange={(e)=>handleUpdateAnswer(index, e.target.value)} />
                                )}

                                {question.mask && (
                                    <PreviewMaskedQuestion question={question} defaultValue={answer} isViewMode />

                                )}
                            </QuestionPrefixSuffix>
                        </TableCell>

                        <TableCell className="text-right">
                            <FaTrash onClick={() => removeAnswer(index)} />
                        </TableCell>
                    </TableRow>
                ))}

            </TableBody>
        </Table>


        <div className={styles.questions.container}>

            {totalAddedAlready < maxNumberToShow && (
                <>
                    {children}
                    <Button variant="readyActionSmall" onClick={() => addAnotherUI()}>+ Add Another</Button>
                </>
            )}

        </div></>)
}

export default DisplayQuestionMultipleTimes;