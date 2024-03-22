import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import useHandleAnswering from "@hooks/useHandleAnswering";
import { ILocation, IPreviewQuestionProps, IViewQuestion } from "@interfaces/appInterface";
import { useState } from "react";
import ErrorMessage from "../ErrorMessage";



const ViewBuildMode: React.FC<{}> = () => {
    return <Button variant="readyActionSmall" className="w-[180px]" onClick={()=>console.log('clicked')}>Pick Location</Button>;
}

const ViewFullMode: React.FC<IViewQuestion> = ({ question }) => {
    const [position, setPosition] = useState<ILocation>({ lat: undefined, long: undefined });

    const {
        validationMessage,
        handleChange

    } = useHandleAnswering(question)


    const getLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
              
              if (question.options["proximity"]) {
                try {
                  const accuracy = position.coords.accuracy;
                  const proximity = parseInt(question.options["proximity"], 10);
                  if (accuracy > proximity){
                    alert(`The expected accuracy of ${proximity} wasn't met.`)
                    return;
                  }

                } catch (error) {
                  alert('there was an error reading proximity value')
                  return;
                }
                

              }
              setPosition({
                lat: position.coords.latitude,
                long: position.coords.longitude,
              });

              handleChange(`${position.coords.latitude}, ${position.coords.longitude}`)
              
            });
          } else {
            alert("Geolocation is not supported in your browser")
          }
    }
   
   
        return (<div className="flex flex-col space-y-3.5 > * + *">
            <Button onClick={getLocation} variant="readyActionSmall" className="w-[180px]">Get Location</Button>
            {position.lat && position.long && (
                <Label>{position.lat} {position.long}</Label>
            )}
        
            <ErrorMessage message={validationMessage} />
        </div>
        )
    
   


}


const PreviewLocationQuestion : React.FC<IPreviewQuestionProps> = ({ question, isViewMode }) => {
    if (!isViewMode) return <ViewBuildMode />
    return <ViewFullMode question={question} />
};

export default PreviewLocationQuestion;