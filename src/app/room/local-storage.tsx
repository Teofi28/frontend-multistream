import { Url, YoutubeId } from "@/utils/helper-types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Data = [MediaDeviceInfo | null, InputDeviceInfo | null, Url[], YoutubeId[]];

export default function useCustomLocalStorage() {
  const [data, setData] = useState<Data>([null, null, [], []]);
  const { replace } = useRouter();

  useEffect(() => {
    const cameraAsJson = localStorage.getItem("cameraInfo");
    const microphoneAsJson = localStorage.getItem("microphoneInfo");
    const urlsAsJson = localStorage.getItem("urls");
    const youtubeAsJson = localStorage.getItem("youtubeIds")
    if (!cameraAsJson || !microphoneAsJson || !urlsAsJson || !youtubeAsJson) {
      replace("/preview-room");
      return;
    }
    const camera = JSON.parse(cameraAsJson);
    const microphone = JSON.parse(microphoneAsJson);
    const urls = JSON.parse(urlsAsJson);
    const youtubeIds = JSON.parse(youtubeAsJson)

    setData([camera, microphone, urls, youtubeIds]);
  }, []);

  return data;
}
