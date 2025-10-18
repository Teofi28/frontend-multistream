import { CustomLocalParticipant } from "@/utils/twilio";
import { useEffect, useRef } from "react";

type Props = {
  participant: CustomLocalParticipant;
};

export default function ParticipantComponent({ participant }: Props) {

  const video = useRef<null | HTMLVideoElement>(null)
  useEffect(() => {
    const element = video.current
    if(!element || !participant.videoStream)
      return
    const media = new MediaStream()
    media.addTrack(participant.videoStream)
    element.srcObject = media
    element.play()


    return () => {
      participant.videoStream?.stop()
    }

   }, [participant])

  return (
    <div className="flex box-border w-[40%] h-[50%] max-h-[50%] max-w-[40%] flex-col m-3">
      <p className="text-center font-bold">{participant.username}</p>
      <video
        className="w-[100%] h-[100%]  object-fill"
        ref={video}
      />
    </div>
  );
}
