import { useEffect, useState } from "react";

export function useMicrophonesInfo() {
  const [microphones, setMicrophones] = useState<InputDeviceInfo[]>([]);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(() => {
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) =>
          setMicrophones(
            devices.filter(
              (device) => device.kind === "audioinput",
            ) as InputDeviceInfo[],
          ),
        );
    });
  }, []);
  return microphones;
}
