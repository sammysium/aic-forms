import { IActiveRecord } from "@contexts/AppContext";
import { EUIType, IDragAndDrop, IFindRecords, Question, Section, SubSection } from "@interfaces/appInterface";
import { findContentById } from "@utils/search";

export type FBActions =
  { type: 'CREATE_NEW_SECTION'; payload: Section }
  | { type: 'DELETE_SECTION'; payload: Section }
  | { type: 'UPDATE_SECTION'; payload: Partial<Section> }
  | { type: 'CREATE_NEW_SUB_SECTION'; payload: { subSection: SubSection, intoSectionIndex: number } }
  | { type: 'DELETE_SUB_SECTION'; payload: SubSection }
  | { type: 'UPDATE_SUB_SECTION'; payload: {id: string, subSection: Partial<SubSection> }}
  | { type: 'DELETE_QUESTION'; payload: string }
  | { type: 'SET_VIEW_MODE'; payload: boolean}
  | { type: 'SET_ACTIVE_SECTION'; payload: number }
  | { type: 'SET_ACTIVE_SUB_SECTION'; payload: { sectionIndex: number; subSectionIndex: number } }
  | { type: 'SET_ACTIVE_QUESTION'; payload: { sectionIndex: number; subSectionIndex: number; questionIndex: number } }
  | { type: 'HANDLE_DND', payload: IDragAndDrop}
  | { type: 'ADD_NEW_QUESTION', payload: Question}
  | { type: 'EDIT_QUESTION', payload: Question}
  ;

  export interface IAppState {
    content: Section[];
    activeRecord: IActiveRecord,
    inViewMode: boolean
  }


export const fbReducer = (state: IAppState, action: FBActions): IAppState => {
  // below declaration are to avoid lexi declaration warning
  let foundItem: IFindRecords

  switch (action.type) {
    case 'SET_VIEW_MODE':
      return {
        ...state,
        inViewMode: action.payload
      }
    case 'CREATE_NEW_SECTION':
      return {
        ...state,
        content: [...state.content, action.payload],
        activeRecord: {
          ...state.activeRecord,
          sectionIndex: state.content.length,
          sectionId: action.payload.id,
          subSectionId: "",
          questionId: "",
          subSectionIndex: -1,
          questionIndex: -1,
        },
      };

    case 'DELETE_SECTION':
      const activeRecord = state.activeRecord
      if (activeRecord.sectionId === action.payload.id) {
        activeRecord.questionId = ""
        activeRecord.questionIndex = -1
        activeRecord.subSectionId = ""
        activeRecord.sectionId = ""
        activeRecord.sectionIndex = -1
        activeRecord.subSectionIndex = -1
      }
      return {
        ...state,
        content: state.content.filter(sec => sec.id !== action.payload.id && sec.euiType === EUIType.Section),
        activeRecord
      }

      case 'DELETE_QUESTION':
        const { content } = state;
      
        // Find the index of the question to delete
        foundItem = findContentById(content, action.payload);
      
        if (foundItem.questionIndex > -1) {
          // Create a copy of the content array
          const newContent = [...content];
      
          if (foundItem.sectionIndex > -1 && foundItem.subSectionIndex > -1) {
            // Question is inside a SubSection
            const subSection = { ...newContent[foundItem.sectionIndex].content[foundItem.subSectionIndex] };
      
            if ('questions' in subSection) {
              // Remove the question from the questions array
              subSection.questions = subSection.questions.filter((_, index) => index !== foundItem.questionIndex);
      
              // Update the SubSection in the newContent array
              newContent[foundItem.sectionIndex].content[foundItem.subSectionIndex] = subSection;
            }
          } else if (foundItem.sectionIndex > -1) {
            // Question is inside a Section's content directly
            newContent[foundItem.sectionIndex].content = newContent[foundItem.sectionIndex].content.filter(
              (_, index) => index !== foundItem.questionIndex
            );
          }
      
          // Return the updated state
          return {
            ...state,
            content: newContent,
          };
        }
      
        // Return the current state if the question was not found
        return state;
      
      
      

    case 'UPDATE_SECTION':
      const updatedContent = state.content.map(section => {
        if (section.id === action.payload.id) {
          return {
            ...section,
            description: action.payload.description ?? section.description,
            label: action.payload.label ?? section.label,
            showLogic: action.payload.showLogic ?? section.showLogic,
            skipLogic: action.payload.skipLogic ?? section.skipLogic,
          };
        }
        return section;
      });
    
      return {
        ...state,
        content: updatedContent,
      };


     
      case 'CREATE_NEW_SUB_SECTION':
        const updatedContentWithNewSubSection = state.content.map((section, index) => {
          if (index === action.payload.intoSectionIndex) {
            return {
              ...section,
              content: [...section.content, action.payload.subSection],
            };
          }
          return section;
        });
      
        return {
          ...state,
          content: updatedContentWithNewSubSection,
          activeRecord: {
            ...state.activeRecord,
            subSectionIndex: updatedContentWithNewSubSection[action.payload.intoSectionIndex].content.length - 1,
            questionIndex: -1,
            subSectionId: action.payload.subSection.id,
            questionId: "",
          },
        };
      

        case 'DELETE_SUB_SECTION':
          foundItem = findContentById(state.content, action.payload.id);
        
          if (foundItem.sectionIndex > -1 && foundItem.subSectionIndex > -1) {
            const updatedContentAfterDeletion = state.content.map((section, index) => {
              if (index === foundItem.sectionIndex) {
                return {
                  ...section,
                  content: section.content.filter((subSection, subIndex) => subIndex !== foundItem.subSectionIndex),
                };
              }
              return section;
            });

            const activeRecord = state.activeRecord
            if (activeRecord.subSectionId === action.payload.id) {
              activeRecord.questionId = ""
              activeRecord.questionIndex = -1
              activeRecord.subSectionId = ""
              activeRecord.subSectionIndex = -1
            }
        
            return {
              ...state,
              content: updatedContentAfterDeletion,
              activeRecord
            };
          }
        
          return state;

          case 'UPDATE_SUB_SECTION':
            foundItem = findContentById(state.content, action.payload.id);
          
            if (foundItem.sectionIndex > -1 && foundItem.subSectionIndex > -1) {
              const updatedContent = state.content.map((section, index) => {
                if (index === foundItem.sectionIndex) {
                  return {
                    ...section,
                    content: section.content.map((subSection, subIndex) => {
                      if (subIndex === foundItem.subSectionIndex) {
                        const info = action.payload.subSection
                        return {
                          ...subSection,
                          description: info.description ?? subSection.description,
                          label: info.label ?? subSection.label,
                          showLogic: info.showLogic ?? subSection.showLogic,
                          skipLogic: info ?? subSection.skipLogic,
                        };
                      }
                      return subSection;
                    }),
                  };
                }
                return section;
              });
          
              return {
                ...state,
                content: updatedContent as Section[],
              };
            }
          
            return state;
          
      
      case 'SET_ACTIVE_SECTION':

      return {
        ...state,
        activeRecord: {
          sectionIndex: action.payload,
          subSectionIndex: -1,
          questionIndex: -1,
          sectionId: "",//TODO FIx me
          subSectionId: "",
          questionId: ""
        }
      }

      case 'ADD_NEW_QUESTION':
        const updatedContentWithNewQuestion = state.content.map((section, index) => {
          if (index === state.activeRecord.sectionIndex) {
            if (state.activeRecord.subSectionIndex === -1) {
              // Add the new question to the section's content
              return {
                ...section,
                content: [...section.content, action.payload],
              };
            } else {
              const contentCopy = [...section.content];
              const subSection = contentCopy[state.activeRecord.subSectionIndex] as SubSection;
      
              if (subSection && subSection.euiType === EUIType.SubSection) {
                // It's a SubSection, add the new question
                const updatedSubSection = {
                  ...subSection,
                  questions: [...subSection.questions, action.payload],
                };
      
                contentCopy[state.activeRecord.subSectionIndex] = updatedSubSection;
              }
      
              return {
                ...section,
                content: contentCopy,
              };
            }
          }
      
          return section;
        });
      
        return {
          ...state,
          content: updatedContentWithNewQuestion,
          activeRecord: {
            ...state.activeRecord,
            questionId: action.payload.id,
          },
        };
      

      case 'HANDLE_DND':
        const draggedItem = findContentById(state.content, action.payload.draggedItemId)
        if (!draggedItem.record) return state;
        const droppedToItem = findContentById(state.content, action.payload.droppedToItemId)
        if (!droppedToItem.record) return state;

        /*
        both found. consider scenarious now
            1. a section can be draggover over to a section only
            2. subsection can be moved within its section only
            3. a question can be moved within its section or if within a subsection, within tha sub section only
        */
       let currentState = state.content
       const {euiType} = draggedItem.record
       if (euiType === EUIType.Section && droppedToItem.sectionIndex > -1) {
        // dragged a section.
         const [removedItem] = currentState.splice(draggedItem.sectionIndex , 1)
         currentState.splice(droppedToItem.sectionIndex, 0, removedItem)
       } else if  ( droppedToItem.sectionIndex === draggedItem.sectionIndex) {
        // within the same section. so let's see what was the dragged thing
      
          if (euiType === EUIType.SubSection) {
          
            const content = [...currentState[draggedItem.sectionIndex].content];
            const droppedToIndex = droppedToItem.questionIndex === -1 ? droppedToItem.subSectionIndex : droppedToItem.questionIndex

            const movedItem = content.splice(draggedItem.subSectionIndex, 1)[0];
            const reduceBy = (droppedToIndex - draggedItem.subSectionIndex) === 1 ? 0 : 1
            if (draggedItem.subSectionIndex < droppedToIndex) {
                content.splice(droppedToIndex - reduceBy , 0, movedItem);
            } else {
                content.splice(droppedToIndex, 0, movedItem);
            }
            
            currentState = currentState.map((item, index) => {
              if (index === draggedItem.sectionIndex) {
                // Return a new object with the updated 'content'
                return {
                  ...item, // Spread the existing properties of the item
                  content: content // Update the 'content' property
                };
              }
              // For other items, return them unchanged
              return item;
            });
            
          } else {
            // a question was dragged. now a question can move within its container only.
            // within section it directly sits on or within a subsection its currently in only.
            if (draggedItem.subSectionIndex > -1 && (droppedToItem.subSectionIndex === draggedItem.subSectionIndex) && (droppedToItem.questionIndex > -1)) {
              // within a sub section.
              
              const content = currentState[draggedItem.sectionIndex].content[draggedItem.subSectionIndex] as SubSection;
              const newQuestions = [...content.questions];
              
              const movedItem = newQuestions.splice(draggedItem.questionIndex, 1)[0];
              
              const reduceBy = (droppedToItem.questionIndex - draggedItem.questionIndex) === 1 ? 0 : 1;
              
              // Insert the moved item into the new position
              if (draggedItem.questionIndex < droppedToItem.questionIndex) {
                newQuestions.splice(droppedToItem.questionIndex - reduceBy, 0, movedItem);
              } else {
                newQuestions.splice(droppedToItem.questionIndex, 0, movedItem);
              }
              
              const updatedContent = {
                ...content,
                questions: newQuestions,
              };
              
              currentState = currentState.map((item, index) => {
                if (index === draggedItem.sectionIndex) {
                  return {
                    ...item,
                    content: item.content.map((subSection, subIndex) => {
                      if (subIndex === draggedItem.subSectionIndex) {
                        return updatedContent;
                      }
                      return subSection;
                    }),
                  };
                }
                return item;
              });
              
            
              
              
              

            } else if (draggedItem.subSectionIndex === -1) {
              //within a section
              const content = [...currentState[draggedItem.sectionIndex].content];
              const droppedToIndex = droppedToItem.questionIndex === -1 ? droppedToItem.subSectionIndex : droppedToItem.questionIndex
  
              const movedItem = content.splice(draggedItem.questionIndex, 1)[0];
              const reduceBy = (droppedToIndex - draggedItem.questionIndex) === 1 ? 0 : 1
              if (draggedItem.questionIndex < droppedToIndex) {
                  content.splice(droppedToIndex - reduceBy , 0, movedItem);
              } else {
                  content.splice(droppedToIndex, 0, movedItem);
              }
              
              currentState = currentState.map((item, index) => {
                if (index === draggedItem.sectionIndex) {
                  // Return a new object with the updated 'content'
                  return {
                    ...item, // Spread the existing properties of the item
                    content: content // Update the 'content' property
                  };
                }
                // For other items, return them unchanged
                return item;
              });

            } 
          }
       }


      return {
        ...state,
        content: currentState
      };
      
  /*
      case 'SET_ACTIVE_SUB_SECTION':
        return {
          ...state,
          activeRecord: {
            sectionIndex: action.payload.sectionIndex,
            subSectionIndex: action.payload.subSectionIndex,
            questionIndex: -1,
          },
        };
  
      case 'SET_ACTIVE_QUESTION':
        return {
          ...state,
          activeRecord: {
            sectionIndex: action.payload.sectionIndex,
            subSectionIndex: action.payload.subSectionIndex,
            questionIndex: action.payload.questionIndex,
          },
        };
        */
    default:
      return state;
  }
};