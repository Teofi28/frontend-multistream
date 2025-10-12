import { webrtcError, webrtcInfo } from "@/utils/console-logs";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import acquireMedia from "./acquire-media";

type RTCPeerConnectionProps = {
  setCameraWebTrack: Dispatch<SetStateAction<MediaStreamTrack | undefined>>;
  deviceInfo: MediaDeviceInfo | null;
  username: string;
  url: string;
};

export function useRTCPeerConnection({
  setCameraWebTrack,
  deviceInfo,
  username,
  url,
}: RTCPeerConnectionProps) {
  const [connection, setConnection] = useState<RTCPeerConnection | null>(null);
  useEffect(() => {
    const connect = async () => {
      if (!deviceInfo) return;
      const rtcConnection = new RTCPeerConnection({
        iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
      });
      let raiseReconnect = false;
      rtcConnection.addEventListener("track", (event) => {
        setCameraWebTrack(event.track);
      });
      rtcConnection.addEventListener("connectionstatechange", () => {
        if (rctIsClosed(rtcConnection) && !raiseReconnect) {
          raiseReconnect = true;
          before_reconnect(
            username + " is failed or disconnect",
            rtcConnection,
          );
          connect();
        }
        if (rtcConnection.connectionState === "connected") {
          raiseReconnect = false;
          webrtcInfo(username, "is connected");
        }
      });
      setConnection(rtcConnection);
      await acquireMedia({
        rtcConnection,
        username,
        url,
        reconnect: (error: string) => {
          before_reconnect(error, rtcConnection);
          connect();
        },
        deviceInfo,
      });
    };
    connect();
  }, [deviceInfo]);
  return connection;
}

function rctIsClosed(rtcConnection: RTCPeerConnection) {
  return ["failed", "disconnected"].includes(rtcConnection.connectionState);
}

function before_reconnect(error: string, rtcConnection: RTCPeerConnection) {
  webrtcError(error);
  webrtcInfo("reconnecting");
  removeTracks(rtcConnection);
  rtcConnection.close();
}

function removeTracks(rtcConnection: RTCPeerConnection) {
  rtcConnection.getSenders().forEach((sender) => {
    sender.track?.stop();
    rtcConnection.removeTrack(sender);
  });
}
