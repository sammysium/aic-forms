import {useDroppable} from '@dnd-kit/core';

interface IProps {
    id: string;
    accepts: string[];
    children: JSX.Element
}

interface IPropsContainer extends IProps {
  viewMode: boolean
}

const DroppableUI : React.FC<IProps> = ({id, accepts, children}) => {
  const {setNodeRef} = useDroppable({
    id,
    data: {
     accepts,

    }
  });

  return (
    <div ref={setNodeRef}>
      {children}
    </div>
  );
}


const Droppable : React.FC<IPropsContainer> = ({id, accepts, children, viewMode}) => {
   if (!viewMode) return(<DroppableUI id={id} accepts={accepts}>{children}</DroppableUI>)
  return (
    <div>
      {children}
    </div>
  );
}

export default Droppable;