"use client";

import { useSocketIo } from "@/hooks/socket-hoook";
import { useStartTwilio } from "@/hooks/twilio-hooks";
import { useRTCPeerConnection } from "@/hooks/web-rtc/web-rtc-hooks";
import { connectWebRtcUrl } from "@/hooks/web-rtc/web-rtc-url";
import { useEffect, useState } from "react";
import { LocalParticipant } from "twilio-video";
import { CustomLocalParticipant } from "./helper-types";
import useCustomLocalStorage from "./local-storage";
import MenuBar from "./menu-bar";
import ParticipantComponent from "./participant-component";
import { Url } from "@/utils/helper-types";

type Props = {
  username: string;
  token: string;
  domainAPI: string;
  domainSocketio: string;
  domainWebsocket: string;
};

export default function Room({ domainAPI, username, token, domainSocketio }: Props) {
  const [cameraInfo, microphoneInfo, urls, youtube] = useCustomLocalStorage();

  if (username.length === 0) throw new Error("error 2");
  const socket = useSocketIo(`${domainSocketio}`, username);
  const [cameraWebTrack, setCameraWebTrack] = useState<MediaStreamTrack>();
  const [participants, setParticipants] = useState<CustomLocalParticipant[]>([]);
  const [localParticipant, setLocalParticipant] = useState<LocalParticipant | null>(null);

  useStartTwilio(cameraInfo, token, "test", setParticipants, microphoneInfo, setLocalParticipant, cameraWebTrack);

  useRTCPeerConnection({
    setCameraWebTrack,
    deviceInfo: cameraInfo,
    username,
    url: `${domainAPI}/offer`,
  });

  useEffect(() => {
    if (!urls || localParticipant?.state !== "connected") return;
    urls.forEach((url) => {
      connectWebRtcUrl(`${domainAPI}/offer`, "test", url, "videocamera");
    });
  }, [urls, localParticipant]);


  useEffect(() => {
    if (!urls || localParticipant?.state !== "connected") return;
    youtube.forEach((item) => {
      const url:Url = {url:item.url, id:item.videoId}
      connectWebRtcUrl(`${domainAPI}/offer`, "test", url, "youtube");
    });
  }, [urls, localParticipant]);

  if (!cameraInfo || !microphoneInfo) return <></>;

  return (
    <div className="absolute top-0 left-0 gap-x-3 p-3 right-0 bottom-0 w-full h-full flex flex-row">
      {socket && <MenuBar socket={socket} username={username} />}
      <div className=" flex flex-col h-full bg-red-50 flex-grow ">
        <div className="flex flex-row flex-grow flex-wrap overflow-y-scroll justify-center items-center">
          {participants.map((participant) => (
            <ParticipantComponent key={participant.username} participant={participant} />
          ))}
        </div>
        <div className="flex flex-col items-center py-5 bg-[#303230] border border-red-500">
          <p className="text-center text-white font-bold text-1xl md:text-4xl">LIVE STREAMING</p>
          <p className="h-[50px] w-[60%] bg-red-800"></p>
        </div>
      </div>
    </div>
  );
}
