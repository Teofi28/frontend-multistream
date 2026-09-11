"use client";

import { useSocketIo } from "@/hooks/socket-hoook";
import { connectToTwilio, CustomLocalParticipant } from "@/utils/twilio";
import { connectWebRtcUrl } from "@/utils/web-rtc/web-rtc-url";
import { useEffect, useState } from "react";
import useCustomLocalStorage from "./local-storage";
import MenuBar from "./menu-bar";
import ParticipantComponent from "./participant-component";
import { Room as TwilioRoom } from "twilio-video";

type Props = {
  username: string;
  domainAPI: string;
  domainSocketio: string;
  domainWebsocket: string;
};

export default function Room({ domainAPI, username, domainSocketio }: Props) {
  const [urls, roomId] = useCustomLocalStorage();
  const socket = useSocketIo(`${domainSocketio}`, username);
  const [participants, setParticipants] = useState<CustomLocalParticipant[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [logs, setLogs] = useState<string[]>([]); 

  useEffect(()=>{
    document.cookie = "inside=false"
    window.addEventListener("beforeunload", (event) => {
      document.cookie = "inside=true"
      event.preventDefault()
    })
  }, [])

  useEffect(() => {
    if (!roomId) return;

    let room: TwilioRoom | null = null;
    let cancelled = false;

    const connectRoom = async () => {
      const response = await fetch("/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identity: username,
          room: roomId,
        }),
      });

      if (!response.ok) {
        throw new Error("Error generating Twilio token");
      }

      const { token } = await response.json();

      if (cancelled) return;

      room = await connectToTwilio(
        token,
        roomId,
        setParticipants
      );

      if (!cancelled) {
        setIsConnected(true);
      }
    };

    connectRoom().catch((error) => {
      console.error("Error connecting to Twilio room:", error);
    });

    return () => {
      cancelled = true;

      if (room) {
        room.disconnect();
      }

      setIsConnected(false);
    };
  }, [roomId, username]);


  useEffect(() => {
    if (!urls || !roomId || !isConnected) return;
    urls.forEach((url) => {
      connectWebRtcUrl(`${domainAPI}/offer`,roomId, url, (message) => setLogs(prev => [...prev, message]))
    });

  }, [urls, roomId, isConnected, domainAPI]);


  return (
    <div className="absolute top-0 left-0 gap-x-3 p-3 right-0 bottom-0 w-full h-full flex flex-row">
      {socket && <MenuBar socket={socket} username={username} roomId={roomId} logs={logs} />}
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
