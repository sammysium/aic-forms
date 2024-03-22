import { FaArrowDown, FaArrowUp, FaPen, FaTrash } from "react-icons/fa"

interface IProps {
    isViewMode: boolean,
    id: string;
    handleEditRequest: (id: string) => void;
    handleDeleteRequest: (id: string) => void;
    isExpanded: boolean;
    setIsExpanded: (value: boolean) => void;
}

const RecordActionRow: React.FC<IProps> = ({ isViewMode, 
    isExpanded,
    setIsExpanded,
    id, handleDeleteRequest, handleEditRequest }) => {
    if (isViewMode) return null
    const confirmDeletion = () => {
        // eslint-disable-next-line no-restricted-globals
        if (confirm("Are you sure you want to delete the container?")) {
            handleDeleteRequest(id)
        }
    }
    return <div className="flex items-center space-x-3">
        {isExpanded && <FaArrowUp className="text-green-500 handPointer" onClick={()=>setIsExpanded(false)} />}
        {!isExpanded && <FaArrowDown className="text-green-500 handPointer" onClick={()=>setIsExpanded(true)} />}

        <FaTrash className="text-red-500 handPointer" style={{ marginRight: '10px' }} onClick={confirmDeletion} />
        <FaPen className="text-green-500 handPointer" style={{ marginRight: '10px' }} onClick={() => handleEditRequest(id)} />

    </div>
}

export default RecordActionRow