
export interface IAnswer {
    userInput: string,
    questionId: string,
    dateTime?: Date,
    surveyAnswers?: string
}

export interface IHandlErrorContent {
    id: string,
    errorMessage: string
}


export type FCActions = { type: 'ADD_ANSWER', payload: IAnswer } |
{type: 'REMOVE_ANSWER', payload: string} |
{ type: 'HANDLE_ERROR', payload: IHandlErrorContent}

export interface IAnswersAppState {
    answers: IAnswer[],
    errorFulQuestionIDs: string[] 
}

export const formConsumereducer = (state: IAnswersAppState, action: FCActions) : IAnswersAppState => {
    let answers : IAnswer[] = []
    switch (action.type) {
        case 'ADD_ANSWER':
            action.payload.dateTime = new Date()
            answers = [...state.answers]
            const currentAnswerIndex = answers.findIndex(ans => ans.questionId === action.payload.questionId)
            if (currentAnswerIndex === -1 ){
                answers.push(action.payload)
            } else{
                answers[currentAnswerIndex].userInput = action.payload.userInput
            }

            return {
                ...state,
                answers
            }
        case 'REMOVE_ANSWER':
           return state
        
           case 'HANDLE_ERROR':
            const { payload } = action;
          
            // Check if the error ID is already in the errorFulQuestionIDs array
            const hasError = state.errorFulQuestionIDs.includes(payload.id);
          
            // Create a new array based on the current state
            let updatedErrorFulQuestionIDs;
          
            if (hasError) {
              // If the error already exists, remove it from the array
              updatedErrorFulQuestionIDs = state.errorFulQuestionIDs.filter(id => id !== payload.id);
            } else {
              // If the error does not exist, add it to the array
              updatedErrorFulQuestionIDs = [...state.errorFulQuestionIDs, payload.id];
            }
          
            return {
                ...state,
                errorFulQuestionIDs: updatedErrorFulQuestionIDs
            };
          
        default:
            return state

    }

}

export default formConsumereducer;