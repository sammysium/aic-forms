import { styles } from "@styles/styles";
import isEmpty from "validator/lib/isEmpty"

interface IProps {
    prefix?: string;
    suffix?: string;
    children: React.ReactNode
}

interface ITextProps {
    text: string
}

const Prefix: React.FC<ITextProps> = ({ text }) => {
    return (<div className={styles.questions.preSuffix}>{text}</div>)
}

const Suffix: React.FC<ITextProps> = ({ text }) => {
    return (<div className={styles.questions.preSuffix}>{text}</div>)
}

const Children: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <div className={styles.questions.questionBlock}>{children}</div>
}

const QuestionPrefixSuffix: React.FC<IProps> = ({ prefix, suffix, children }) => {

    const hasPrefix = prefix !== undefined && !isEmpty(prefix)
    const hasSuffix = suffix !== undefined && !isEmpty(suffix)
    return (
        <div className={styles.questions.questionBlock}>
            {!hasPrefix && !hasSuffix && (<Children>{children}</Children>)}
            {hasPrefix && !hasSuffix && (
                <div className={styles.questions.preSuffixContainter}>
                    <Prefix text={prefix} />

                    <Children>{children}</Children>
                </div>
            )}

            {hasSuffix && !hasPrefix  && (
           <div className={styles.questions.preSuffixContainter}>
                <Children>{children}</Children>
                <Suffix text={suffix} />
            </div>
            )}

            {hasPrefix && hasSuffix && (
               <div className={styles.questions.preSuffixContainter}>
                    <Prefix text={prefix} />
                    <Children>{children}</Children>
                    <Suffix text={suffix} />

                </div>
            )}

        </div>
    )
}

export default QuestionPrefixSuffix;