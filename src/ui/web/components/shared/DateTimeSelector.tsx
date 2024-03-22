import React, { useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export enum EDateTimeSelectionPortion {
    fullDate = "fullDate",
    monthYear = "monthYear",
    year = "year",
    fullDateTime = "fullDateTime",
    time = "time"

}

interface IProps {
    onChange: (minDate: Date, maxDate?: Date) => void,
    selectWhat?: EDateTimeSelectionPortion,
    showRange?: boolean,
    minDateRange?: Date,
    maxDateRange?: Date,
    showTimeSelect: boolean,
    editMode: boolean

}


const DateTimeSelector : React.FC<IProps> = ( { editMode, showRange, showTimeSelect, onChange, selectWhat, minDateRange, maxDateRange }) => {
    const [beginDate, setStartDate] = useState<Date>(minDateRange === undefined ?  new Date() : new Date(minDateRange))
    const format = `dd/MM/yyyy${showTimeSelect ? ' - hh:mm' : ''}`;

    const handleChange = (range: any) => {
       
            setStartDate(range)
            onChange(range)
       
      };

 
        return <DatePicker 
                    dateFormat={format}
                    selected={beginDate}
                    minDate={minDateRange}
                    maxDate={maxDateRange}
                    showTimeSelect={showTimeSelect}
                    showMonthDropdown
                    showYearDropdown
                    onChange={(e) => { e && handleChange(e)}} 
                    onSelect={(e) => { e && handleChange(e)}}
                   
/>
     
}

export default DateTimeSelector;