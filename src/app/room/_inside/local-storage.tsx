import { Url } from "@/utils/helper-types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Data = [Url[], string];

export default function useCustomLocalStorage() {
  const [data, setData] = useState<Data>([[], ""]);
  const { replace } = useRouter();

  useEffect(() => {
    const urlsAsJson = localStorage.getItem("urls");
    const roomId = localStorage.getItem("roomId");
    if (!urlsAsJson || !roomId) {
      replace("/room");
      return;
    }
    const urls = JSON.parse(urlsAsJson);
    setData([urls, roomId]);
  }, [replace]);

  return data;
}
