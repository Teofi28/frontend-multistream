"use client";

import Select from "@/components/select";
import { useVideoCamerasInfo } from "@/hooks/camera-hooks";

export default function SelectCamera() {
  const cameras = useVideoCamerasInfo();
  return (
    <Select
      onChangeOption={(option) => {
        const camera = cameras.find((camera) => camera.deviceId === option.value);
        if (!camera) return;
        localStorage.setItem("cameraInfo", JSON.stringify(camera));
      }}
      options={cameras.map((camera) => ({
        value: camera.deviceId,
        label: camera.label,
      }))}
    />
  );
}
