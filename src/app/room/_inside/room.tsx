"use client";

import { useSocketIo } from "@/hooks/socket-hoook";
import { connectToTwilio, CustomLocalParticipant } from "@/utils/twilio";
import { connectWebRtcUrl } from "@/utils/web-rtc/web-rtc-url";
import { useEffect, useState } from "react";
import useCustomLocalStorage from "./local-storage";
import MenuBar from "./menu-bar";
import ParticipantComponent from "./participant-component";
import { Url } from "@/utils/helper-types";
import { Room as TwilioRoom } from "twilio-video";
import { webrtcError } from "@/utils/console-logs";

type Props = {
  username: string;
  token: string;
  domainAPI: string;
  domainSocketio: string;
  domainWebsocket: string;
};

export default function Room({ domainAPI, username, token, domainSocketio }: Props) {
  const [urls, youtube] = useCustomLocalStorage();
  const socket = useSocketIo(`${domainSocketio}`, username);
  const [participants, setParticipants] = useState<CustomLocalParticipant[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false)

  useEffect(()=>{
    document.cookie = "inside=false"
    window.addEventListener("beforeunload", (event) => {
      document.cookie = "inside=true"
      event.preventDefault()
    })
  }, [])

  useEffect(() => {
    let room:TwilioRoom | null = null
    connectToTwilio(token, "test", setParticipants)
    .then((twilioRoom) => {
      room = twilioRoom
      setIsConnected(true)
    });

    return ()=> {
      if(room) room.disconnect()
    }
  }, [])


  useEffect(() => {
    if (!urls || !isConnected) return;
    const connections:RTCPeerConnection[] = []
    urls.forEach(async (url) => {
      try {
      const conn = await connectWebRtcUrl(`${domainAPI}/offer`, "test", url, "videocamera");
      connections.push(conn)
      }
      catch(e){
        webrtcError(`${url.url} raise error when connect to webrtc server`)
      }
    });

  }, [urls, isConnected]);


  useEffect(() => {
    if (!urls || !isConnected) return;
    const connections:RTCPeerConnection[] = []
    youtube.forEach(async (item) => {
      const url:Url = {url:item.url, id:item.videoId}
      const conn = await connectWebRtcUrl(`${domainAPI}/offer`, "test", url, "youtube");
      connections.push(conn)
    });

  }, [youtube, isConnected]);

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
