import { connect, Room } from "twilio-video";
import acquireMedia from "./acquire-media";
import { Url } from "@/utils/helper-types";

export async function connectWebRtcUrl(urlWebrtc: string, room: string, url: Url, input_type:"videocamera" | "youtube"):Promise<RTCPeerConnection> {
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
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
  });
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
  const body = input_type === "videocamera" ?  { input_type, url: url.url }:{input_type, video_id:url.id}
  await acquireMedia({
    rtcConnection: pc,
    username: url.id,
    url: urlWebrtc,
    body,
  });
  return pc
}
