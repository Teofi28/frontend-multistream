import { Dispatch, SetStateAction } from "react";
import {
  connect,
  RemoteParticipant,
  Room,
} from "twilio-video";
import { webrtcInfo } from "./console-logs";

export type CustomLocalParticipant = {
  sid: string;
  username: string;
  videoStream?: MediaStreamTrack;
};

export async function connectToTwilio(
  token: string,
  room: string,
  setParticipants: Dispatch<SetStateAction<CustomLocalParticipant[]>>,
):Promise<Room> {

    const twilioRoom = await connect(token, {
      name: room,
      tracks:[]
    });
    webrtcInfo("current participants")
    twilioRoom.participants.forEach((participant) => {
      webrtcInfo(participant.identity)
      enableAlreadyParticipant(participant, setParticipants)
    });
    webrtcInfo("===============================")
    twilioRoom.on("participantConnected", (participant) => {
      webrtcInfo("participant connected", participant.identity)
      enableAlreadyParticipant(participant, setParticipants);
    });
    twilioRoom.on("participantDisconnected", (participant) => {
      webrtcInfo("participant disconnect", participant.identity)
      setParticipants((participants) =>
        participants.filter((pt) => pt.username !== participant.identity),
      );
    });

    return twilioRoom
}

const enableAlreadyParticipant = (
  participant: RemoteParticipant,
  setParticipants: Dispatch<SetStateAction<CustomLocalParticipant[]>>,
) => {
  const trackPublished = Array.from(participant.videoTracks.values())[0];
  if (!trackPublished) return;
  if (trackPublished.isSubscribed && trackPublished.track) {
    const track = trackPublished.track;
    setParticipants((participants) => {
      return [
        ...participants,
        {
          sid: participant.sid,
          username: participant.identity,
          stream: track.mediaStreamTrack,
        },
      ];
    });
  }

  participant.on("trackSubscribed", (track) => {
    setParticipants((participants) => {
      const finalParticipants = participants.filter(
        (p) => p.username !== participant.identity,
      );
      const localParticipant = participants.find(
        (p) => p.username === participant.identity,
      );
      const objToUpdate = {
        ...localParticipant,
        sid: participant.sid,
        username: participant.identity,
      };
      if (track.kind === "video")
        objToUpdate["videoStream"] = track.mediaStreamTrack;
      finalParticipants.push(objToUpdate);
      return finalParticipants;
    });
  });
};
