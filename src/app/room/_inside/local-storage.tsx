import { Url, Youtube } from "@/utils/helper-types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Data = [ Url[], Youtube[]];

export default function useCustomLocalStorage() {
  const [data, setData] = useState<Data>([[], []]);
  const { replace } = useRouter();

  useEffect(() => {
    const urlsAsJson = localStorage.getItem("urls");
    const youtubeAsJson = localStorage.getItem("youtubeObjects")
    if (!urlsAsJson || !youtubeAsJson) {
      replace("/room");
      return;
    }
    const urls = JSON.parse(urlsAsJson);
    const youtubeIds = JSON.parse(youtubeAsJson)

    setData([urls, youtubeIds]);
  }, []);

  return data;
}
