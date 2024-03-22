import { IPreviewQuestionProps, IViewQuestion, Question } from "@interfaces/appInterface";
import React, { useContext, useEffect } from 'react';
import { useState } from 'react';




const PreviewSurveryQuestion: React.FC<IPreviewQuestionProps> = ({ question, isViewMode }) => {



  const choices = question.choices!!
  const subQuestions = question.subQuestions!!



  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-solid border-gray-300">
        <thead>
          <tr>
            <th className="empty-cell border-b border-solid border-gray-300"></th>
            {choices.map((choice, index) => (
              <th key={choice.label} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b border-solid border-gray-300">
                {choice.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {subQuestions.map((questionLabel, questionIndex) => (
            <tr key={questionLabel}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{questionLabel}</td>
              {choices.map((choice, choiceIndex) => (
                <td key={choice.label} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <input
                    type="radio"
                    id={`question-${question.id}-${questionLabel}`}
                    name={`question-${question.id}-${questionLabel}`}  
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PreviewSurveryQuestion;
