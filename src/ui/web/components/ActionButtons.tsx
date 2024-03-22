import { QuestionType, IActionButton } from "../../../interfaces/appInterface";
import { MdOutlineAlternateEmail,MdCameraAlt, MdOutlineSignLanguage, MdOutlineTableRows, MdOutlineQrCode2, MdOutlineAttachMoney, MdBarcodeReader, MdAddLocation, MdAudiotrack, MdMap, MdFileUpload, MdOutlineOndemandVideo, MdTextFields , MdDocumentScanner,MdOutlineHttp, MdArrowDropDownCircle,MdOutlineCalendarMonth, MdNotes,MdLocalPhone, MdNumbers, MdCheckBox, MdOutlineRadioButtonChecked} from "react-icons/md";

interface IGroupedActionButtons  {
  [key:string]: IActionButton[]
}

export const basicActionButtons: IActionButton[] = [
  {
    label: "Text",
    questionType: QuestionType.Text,
    iconType: MdTextFields
  },
  {
    label: "Text Area",
    questionType: QuestionType.TextArea,
    iconType: MdNotes
  },
  {
    label: "Number",
    questionType: QuestionType.Number,
    iconType: MdNumbers
  },
  {
    label: "Checkbox",
    questionType: QuestionType.CheckBox,
    iconType: MdCheckBox
  },
  {
    label: "Radio",
    questionType: QuestionType.Radio,
    iconType: MdOutlineRadioButtonChecked
  },
  {
    label: "Email",
    questionType: QuestionType.Email,
    iconType: MdOutlineAlternateEmail
  },
  {
    label: "Phone",
    questionType: QuestionType.Phone,
    iconType: MdLocalPhone
  },



  {
    label: "Select",
    questionType: QuestionType.DropDown,
    iconType: MdArrowDropDownCircle
  },
  {
    label: "DateTime",
    questionType: QuestionType.DateTime,
    iconType: MdOutlineCalendarMonth
  },
  {
    label: "Photo",
    questionType: QuestionType.CapturePhoto,
    iconType: MdCameraAlt
  },
  {
    label: "Location",
    questionType: QuestionType.Location,
    iconType: MdAddLocation
  }

]

const advancedActionButtons : IActionButton[] = [

  {
    label: "File Upload",
    questionType: QuestionType.FileUpload,
    iconType: MdFileUpload
  },
  {
    label: "Area Map",
    questionType: QuestionType.AreaMap,
    iconType: MdMap
  },
  {
    label: "Audio",
    questionType: QuestionType.Audio,
    iconType: MdAudiotrack
  },

  {
    label: "Video",
    questionType: QuestionType.Video,
    iconType: MdOutlineOndemandVideo
  },
  {
    label: "BarCode",
    questionType: QuestionType.BarCode,
    iconType: MdBarcodeReader
  },
  {
    label: "Currency",
    questionType: QuestionType.Money,
    iconType: MdOutlineAttachMoney
  },
  {
    label: "QR Code",
    questionType: QuestionType.QRCode,
    iconType: MdOutlineQrCode2
  },
  {
    label: "Signature",
    questionType: QuestionType.Signature,
    iconType: MdOutlineSignLanguage
  },
  {
    label: "URL",
    questionType: QuestionType.URL,
    iconType: MdOutlineHttp
  },
  {
    label: "Survey",
    questionType: QuestionType.Survey,
    iconType: MdOutlineTableRows
  },
  {
    label: "Terms and Conditions",
    questionType: QuestionType.TermsAndConditions,
    iconType: MdDocumentScanner
  },

]

export const groupedActionButtons: IGroupedActionButtons = {
  "Basic": basicActionButtons,
  "Advanced": advancedActionButtons
}

