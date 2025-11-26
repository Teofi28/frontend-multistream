import { connect, Room } from "twilio-video";
import acquireMedia from "./acquire-media";
import { Url } from "@/utils/helper-types";
import { webrtcError, webrtcInfo } from "../console-logs";

export async function connectWebRtcUrl(urlWebrtc: string, room: string, url: Url, onError:(e:string) => void) {
  const times = 5;
  let index = 1;
  const errorEvent = (message:unknown) => { // when it is executed . connect is executed 1 time already
    webrtcError(message)
    webrtcInfo("trying connect to", url.url, index, "times")
    onError(`Error trying connect to ${url.url} ${index} times`)
    if(index < times){
      reconnect()
      index ++;
      return
    }
    onError("Error connect to " + url.url)
    index = 0
  }
  const reconnect = async () => {
    try{
      const tokenResponse = await fetch("/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identity: url.id, room: "test" }),
      });
      if (!tokenResponse.ok) throw Error("Error to generate token");
      const tokenJson = await tokenResponse.json();
      const token = tokenJson.token;
      const pc = new RTCPeerConnection({iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }]});
      let twilioRoom:Room
      pc.ontrack = async (event) => {
        twilioRoom = await connect(token, {
          name: room,
          tracks: [event.track],
        });
      };
      pc.addEventListener("connectionstatechange", () => {
        if(pc.connectionState === "closed" && twilioRoom) {
          // twilioRoom.removeAllListeners()
          // twilioRoom.disconnect()
        }
      })
      await acquireMedia({
        rtcConnection: pc,
        username: url.id,
        url: urlWebrtc,
        body:{url: url.url},
        onError: errorEvent
      });
    }
    catch(error){
      errorEvent(error)
    }
  }
  await reconnect();
}
