import { IAnswer } from "@contexts/reducers/formConsumerReducer";
import { EUIType, IFilterQuestion, IFindRecords, Question, Section, SubSection } from "@interfaces/appInterface";

export const findContentById = (content: Section[], id: string): IFindRecords => {
    const total = content.length;
    let sectionIndex = -1;
    let subSectionIndex = -1;
    let questionIndex = -1;
    for (let i = 0; i < total; i++) {
        const record = content[i]
        const foundId = record.id === id;
        const uiType = record.euiType;
        sectionIndex = i;
        if (uiType === EUIType.Section) {
            if (foundId) return { sectionIndex, subSectionIndex, questionIndex, record }
            // check contents of the section now
            const section = record as Section;
            const content = section.content;
            for (let j = 0; j < content.length; j++) {
                const sectionRecord = content[j]
                const foundInSection = sectionRecord.id === id;
                if (sectionRecord.euiType === EUIType.Question && foundInSection) {
                    return { sectionIndex, subSectionIndex: -1, questionIndex: j, record: sectionRecord }
                }
                else if (sectionRecord.euiType === EUIType.SubSection) {
                    if (foundInSection) return { sectionIndex, subSectionIndex: j, questionIndex: -1, record: sectionRecord }
                    const subSection = sectionRecord as SubSection;
                    for (let k = 0; k < subSection.questions.length; k++) {
                        const question = subSection.questions[k] as Question;
                        if (question.id === id) return { sectionIndex, subSectionIndex: j, questionIndex: k, record: question }
                    }
                }
            }
        }

    }
    return { sectionIndex: -1, subSectionIndex: -1, questionIndex: -1, record: undefined }
}

export const getFilteredQuestions = (data: Section[] ,filterQuestionsBy: IFilterQuestion) : Question[] => {
    const result: Question[] = [];

    const processContent = (content: (SubSection | Question)[] = []) => {
      for (const item of content) {
        if (item.euiType === EUIType.Question && isQuestionValid(item as Question, filterQuestionsBy)) {
          result.push(item as Question);
        } else if (item.euiType === EUIType.SubSection) {
          processContent((item as SubSection).questions);
        }
      }
    };
  
    const isQuestionValid = (question: Question, filter: IFilterQuestion): boolean => {
      const { types, excludeIds } = filter;
      return (
        (!types.length || types.includes(question.type)) &&
        (!excludeIds.length || !excludeIds.includes(question.id))
      );
    };
  
    for (const section of data) {
      processContent(section.content);
    }
  
    return result;

}

export const findAnswerForQuestion = (answers: IAnswer[], question: Question): IAnswer | undefined => {
  return answers.find(a => a.questionId === question.id)
}

export const isQuestionUsedInLogic = (item: Section | SubSection | Question, targetQuestionId: string): boolean => {
  const logicConditions = item.skipLogic.concat(item.showLogic || [])

  for (const condition of logicConditions) {
      if (condition.questionId === targetQuestionId) {
          return true;
      }
  }
  return false;
};

export const questionIsUsedInCalculatedField = (question: Question, targetQuestionId: string): boolean => {

  if (question.isCalculated && question.id !== targetQuestionId) {
      return (
          question.formulaForCalculatedFieldType?.refs.includes(targetQuestionId) || false
      );
  }
  return false;
};

export const questionIsPure = (data: Section[], questionId: string): boolean => {
  // check if the question is used in calculation, skip logic or show logic
  var total = data.length;
  for (var counter = 0; counter < total; counter++) {
      var section = data[counter];
      if (isQuestionUsedInLogic(section, questionId)) {
          return false;
      }
      // check contents of the section now.
      var content = data[counter].content;
      for (var j = 0; j < content.length; j++) {
          if (content[j].euiType === EUIType.Question) {
              var question = content[j] as Question;
              if (questionIsUsedInCalculatedField(question, questionId))
                  return false;
              if (isQuestionUsedInLogic(question, questionId))
                  return false;
          }
          else {
              // it is sub section.
              const subSection = content[j] as SubSection;
              if (isQuestionUsedInLogic(subSection, questionId))
                  return false;
              for (var k = 0; k < subSection.questions.length; k++) {
                  const question = subSection.questions[k] as Question;
                  if (questionIsUsedInCalculatedField(question, questionId))
                      return false;
                  if (isQuestionUsedInLogic(question, questionId))
                      return false;
              }
          }
      }
  }
  return true;
};

export const evaluateFormula = (data: Section[], answers: IAnswer[], formula?: string): number | string => {
  if (!formula) return 0;
  let result = formula;
  // Extract IDs from the formula (e.g., @myid)
  const matches = formula.match(/@([0-9a-zA-Z-]+)/g);

  if (matches) {
      matches.forEach((match) => {
          const id = match.substring(1); // Remove the "@" symbol
          const foundItem = findContentById(data, id)

          if (foundItem.record &&
              foundItem.record.euiType === EUIType.Question
          ) {
              const regex = new RegExp(`@${id}\\b`, "g");
              // gets previously typed answer.
              const answer = answers.find((answer) => answer.questionId === id)
              if (answer) {

                  result = result.replace(regex, answer.userInput);
              }

          }
      });
  }

  try {
      return eval(result)
  } catch (error) {
      return 0
  }

};