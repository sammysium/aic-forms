

import React, { useContext, useState } from 'react';

import isEmpty from 'validator/lib/isEmpty';

import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { MdDelete, MdSort } from "react-icons/md";


import Draggable from './Draggable';
import Droppable from './Droppable';
import { IChoice, Question } from "@interfaces/appInterface";
import { styles } from "@styles/styles";
import { removeNonAlphanumeric } from "@utils/utils";


interface ChoiceComponentProps {
  question: Question,
  handleChoices: (choices: IChoice[]) => void;
}

const containerStyle = styles.containerWithTextInputs;

const ChoicesBuilder: React.FC<ChoiceComponentProps> = ({ handleChoices, question }) => {
  
  const [choices, setChoices] = useState<IChoice[]>(question.choices);
  const [label, setLabel] = useState("")
  const [value, setValue] = useState("")

  const checkLabelIsUnique = (choiceLabel: string, ignoreIndex: number = -1): boolean => {
    return !choices.some((choice, index) => choice.label === choiceLabel && index !== ignoreIndex);
  }



  const addChoice = () => {
    const checkLabel = checkLabelIsUnique(label);
    if (checkLabel && !isEmpty(label) && !isEmpty(value)) {
      const newChoice: IChoice = { label, value };
      const newChoices = [...choices, newChoice]
      setChoices(newChoices);
    
      handleChoices(newChoices)
      setLabel("");
      setValue("");

    }
  }

  const removeChoice = (labelToRemove: string) => {
    const updatedChoices = choices.filter(choice => choice.label !== labelToRemove);
    setChoices(updatedChoices);
    handleChoices(updatedChoices)
  };

  const handleLabel = (label: string) => {
    setLabel(label)
    setValue(removeNonAlphanumeric(label).toLowerCase())
  }

  const updateValue = (v: string, index: number) => {
    const currentChoices = [...choices];
    currentChoices[index].value = v;
    setChoices(currentChoices)
    handleChoices(currentChoices)
  }

  const updateLabel = (v: string, index: number) => {
    const currentChoices = [...choices];
    currentChoices[index].label = v;
    setChoices(currentChoices)
    handleChoices(currentChoices)
  }



  return (<>

    <div className={`${containerStyle} bg-gray-200`}>
      <div className='w-[45px]'>&nbsp;</div>
      <div className='w-[250px] mx-10'>Label</div>
      <div className='w-[250px]'>Value</div>
      <div className='w-[100px]'>&nbsp;</div>
    </div>

    {choices.map((choice, index) => (

      <div className='flex flex-row my-5' key={`${question.id}-${index}`}>
       
            <div className='w-[45px] pt-2'><MdSort /></div>
          

        <div className='w-[250px] mx-10' data-no-dnd="true">
          <Input value={choices[index].label} onChange={(e) => updateLabel(e.target.value, index)} />
        </div>
        <div className='w-[250px]' data-no-dnd="true">

          <Input value={choices[index].value} onChange={(e) => updateValue(e.target.value, index)} />

        </div>
        <div className='w-[100px] px-3 flex-row flex' data-no-dnd="true">
          <Button variant="readyActionSmall" className='bg-red-500' onClick={() => removeChoice(choice.label)}><MdDelete /></Button>
        </div>
      </div>

    ))}

    <div className={`${containerStyle}`} data-no-dnd="true">
      <div className='w-[75px]'>&nbsp;</div>
      <div className='w-[250px] mx-10'>
        <Input
          type="text"
          placeholder="Label"
          value={label}
          onChange={e => handleLabel(e.target.value)}
          id="label"
        />
      </div>
      <div className='w-[250px]'>
        <Input
          type="text"
          placeholder="Value"
          value={label}
          onChange={e => setValue(e.target.value)}
          id="value"
        />
      </div>
    </div>

    <div className="flex items-center justify-center w-full" data-no-dnd="true">
      <Button variant="readyActionSmall" className='w-[100px]'
        onClick={addChoice}
      >
        + Add Another
      </Button>
    </div>
  </>);

}

export default ChoicesBuilder;