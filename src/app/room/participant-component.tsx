import { CustomLocalParticipant } from "./helper-types";

type Props = {
  participant: CustomLocalParticipant;
};

export default function ParticipantComponent({ participant }: Props) {
  return (
    <div className="flex box-border w-[40%] h-[50%] max-h-[50%] max-w-[40%] flex-col m-3">
      <p className="text-center font-bold">{participant.username}</p>
      <video
        autoPlay
        playsInline
        className="w-[100%] h-[100%]  object-fill"
        ref={(element) => {
          if (!participant.stream) return;
          const media = new MediaStream();
          media.addTrack(participant.stream);
          if (element) element.srcObject = media;
        }}
      />
      <audio
        autoPlay
        ref={(element) => {
          if (!element) return;
          if (!participant.audioStream) return;
          const media = new MediaStream();
          media.addTrack(participant.audioStream);
          element.srcObject = media;
        }}
        hidden
      ></audio>
    </div>
  );
}
