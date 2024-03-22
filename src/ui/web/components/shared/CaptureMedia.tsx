import Webcam from "react-webcam";
import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import ReactCrop, { type Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

enum EFormats {
    "jpeg" = "image/jpeg",
    "png" = "image/png"
}

const cameraOptions = {
    width: 600,
    height: 600,
    photo: {
        quality: 0.6,
        format: EFormats
    },
    video: {
        aspectRatio: 0.6666666667,
        facingMode: "user",
        width: { min: 480 },
        height: { min: 720 },
    }

}

interface IProps {
    takePhoto: boolean;
    handleTakenPhoto?: (imageSrc: string) => void;
    hanleShotVideo?: (videoSrc: string) => void;
}

const CaptureMedia: React.FC<IProps> = ({ handleTakenPhoto, hanleShotVideo, takePhoto }) => {
    const [croppedImage, setCroppedImage] = useState<Crop>()
    const webcamRef = useRef<any>(null);
    const mediaRecorderRef = useRef<any>(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [capturingVideo, setCapturingVideo] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);


    const retakePhoto = () => {
        setImgSrc(null);
    };

    const capturePhoto = useCallback(() => {
        if (webcamRef.current !== null && handleTakenPhoto) {
            const imageSrc = webcamRef.current.getScreenshot();
            handleTakenPhoto(imageSrc)
            setImgSrc(imageSrc);
        }

    }, [webcamRef, handleTakenPhoto]);

    // vide capturing
    const handleDataAvailable = useCallback(
        ({ data }: { data: any }) => {
            if (data.size > 0) {
                setRecordedChunks((prev) => prev.concat(data));
            }
        },
        [setRecordedChunks]
    );


    const handleStartCaptureClick = useCallback(() => {
        setCapturingVideo(true);
        mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
            mimeType: "video/webm"
        });
        mediaRecorderRef.current.addEventListener(
            "dataavailable",
            handleDataAvailable
        );
        mediaRecorderRef.current.start();
    }, [webcamRef, handleDataAvailable, setCapturingVideo, mediaRecorderRef]);



    const handleStopCaptureClick = useCallback(() => {
        webcamRef.current.stop();
        setCapturingVideo(false);
    }, [webcamRef, setCapturingVideo]);

    const handleDownload = useCallback(() => {
        if (recordedChunks.length) {
            const blob = new Blob(recordedChunks, {
                type: "video/webm"
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            document.body.appendChild(a);
            a.href = url;
            a.download = "react-webcam-stream-capture.webm";
            a.click();
            window.URL.revokeObjectURL(url);
            setRecordedChunks([]);
        }
    }, [recordedChunks]);

    // end of video capturing

    return (<div>
        <Webcam
            height={cameraOptions.height}
            width={cameraOptions.height}
            ref={webcamRef}
            screenshotFormat={cameraOptions.photo.format.jpeg}
            screenshotQuality={cameraOptions.photo.quality}
            videoConstraints={cameraOptions.video}
            audio={!takePhoto}
        />

        {(takePhoto && imgSrc) && (
            <ReactCrop crop={croppedImage} onChange={c => setCroppedImage(c)}>
                <img src={imgSrc} alt="web cam" />
            </ReactCrop>
        )}

        {takePhoto && (
            <>
                {imgSrc ? (
                    <Button variant="readyActionSmall" onClick={retakePhoto}>
                        Retake photo
                    </Button>
                ) : (
                    <Button variant="readyActionSmall" onClick={capturePhoto}>
                        Take Photo
                    </Button>
                )}
            </>
        )}

        {!takePhoto && (
            <> 
            {capturingVideo ? (
                <button onClick={handleStopCaptureClick}>Stop Capture</button>
            ) : (
                <button onClick={handleStartCaptureClick}>Start Capture</button>
            )}
            {recordedChunks.length > 0 && (
                <button onClick={handleDownload}>Download</button>
            )}
            
            </>
        )}

       
    </div>);
}

export default CaptureMedia;