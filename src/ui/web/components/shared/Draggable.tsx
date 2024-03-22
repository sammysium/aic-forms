import {useDraggable} from '@dnd-kit/core';
import {CSS} from "@dnd-kit/utilities"



interface IProps {
  id: string;
  type: string;
  children: JSX.Element;
  data: any
}

interface IPropsContainer extends IProps {
  viewMode: boolean
}

const DraggableUI: React.FC<IProps> = ({ id , data, type, children}) => {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id,
    data : {
      ...data,
      type
    },
  })


  return (
    <div 
    

      {...attributes} 
      {...listeners} 
      ref={setNodeRef} 
      style={{transform: CSS.Translate.toString(transform)}}
    >
      {children}
    </div>
  );
};

const Draggable: React.FC<IPropsContainer> = ({ id , data, type, children, viewMode}) => {
  
  if (!viewMode) return <DraggableUI id={id} data={data} type={type}>{children}</DraggableUI>

  return (
    <div>
      {children}
    </div>
  );
};

export default Draggable;
