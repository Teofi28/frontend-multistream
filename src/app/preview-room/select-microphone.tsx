"use client";

import Select from "@/components/select";
import { useMicrophonesInfo } from "@/hooks/microphone-hooks";

export default function SelectMicrophone() {
  const microphones = useMicrophonesInfo();
  return (
    <Select
      onChangeOption={(option) => {
        const microphone = microphones.find((microphone) => microphone.deviceId === option.value);
        if (!microphone) return;
        localStorage.setItem("microphoneInfo", JSON.stringify(microphone));
      }}
      options={microphones.map((microphone) => ({
        value: microphone.deviceId,
        label: microphone.label,
      }))}
    />
  );
}
