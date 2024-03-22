import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

interface IProps {
    onChange : (value: string) => void;
    initialValue: string;
}

const  RichTextEditor : React.FC<IProps> = ( { onChange, initialValue }) => {
  const [editorValue, setEditorValue] = useState(initialValue);

  const handleChange = (value: string) => {
    setEditorValue(value);
    onChange(value);
  }

  return (
    <ReactQuill
      className='h-[180px] mb-8'
      value={editorValue}
      onChange={(value) => handleChange(value)}
    />
  );
}

export default RichTextEditor;
