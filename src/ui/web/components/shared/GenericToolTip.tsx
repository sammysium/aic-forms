
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { MdHelp } from "react-icons/md";
import { styles } from "@styles/styles";
import isEmpty from "validator/lib/isEmpty"

interface IProps {
  tip?: string
}

const GenericToolTip: React.FC<IProps> = ({ tip }) => {
  if (!tip || (isEmpty(tip))) return null
  return <div className={styles.questions.toolTip}><TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <MdHelp />
      </TooltipTrigger>
      <TooltipContent>
        <p>{tip}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
  </div>;
}

export default GenericToolTip;