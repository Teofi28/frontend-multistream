import { useEffect, useState } from "react";

export function useVideoCamerasInfo() {
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then(() => {
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) =>
          setCameras(devices.filter((device) => device.kind === "videoinput")),
        );
    });
  }, []);
  return cameras;
}
