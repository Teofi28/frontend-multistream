import { webrtcInfo } from "@/utils/console-logs";

type Props = {
  rtcConnection: RTCPeerConnection;
  username: string;
  url: string;
  reconnect?: (error: string) => void;
  deviceInfo?: MediaDeviceInfo;
  body?: {};
};

export default async function acquireMedia({
  rtcConnection,
  username,
  url,
  reconnect,
  deviceInfo,
  body = { input_type: "cameraweb" },
}: Props) {
  if (rtcConnection.connectionState === "connected") return;
  if (deviceInfo) {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: { exact: deviceInfo.deviceId },
      },
    });

    stream.getTracks().forEach((track) => {
      rtcConnection.addTrack(track, stream);
    });
  } else {
    rtcConnection.addTransceiver("video", { direction: "recvonly" });
  }
  rtcConnection
    .createOffer({ iceRestart: true })
    .then((offer) => rtcConnection.setLocalDescription(offer))
    .then(() => {
      const resolve = () => {
        const offer = rtcConnection.localDescription;
        if (!offer) throw Error("Don't can't stablish offer");
        fetch(url, {
          body: JSON.stringify({
            sdp: offer.sdp,
            type: offer.type,
            userId: username,
            ...body,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        })
          .then((response) => response.json())
          .then((answer) => rtcConnection.setRemoteDescription(answer))
          .catch(reconnect);
      };
      if (rtcConnection.iceGatheringState === "complete") {
        resolve();
      } else {
        webrtcInfo(rtcConnection.iceGatheringState, username);
        const checkstate = () => {
          if (rtcConnection.iceGatheringState === "complete") {
            rtcConnection.removeEventListener(
              "icegatheringstatechange",
              checkstate,
            );
            resolve();
          }
        };
        rtcConnection.addEventListener("icegatheringstatechange", checkstate);
      }
    })
    .catch(reconnect);
}
