import { Url } from "@/utils/helper-types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Data = [ Url[] ];

export default function useCustomLocalStorage() {
  const [data, setData] = useState<Data>([[]]);
  const { replace } = useRouter();

  useEffect(() => {
    const urlsAsJson = localStorage.getItem("urls");
    if (!urlsAsJson) {
      replace("/room");
      return;
    }
    const urls = JSON.parse(urlsAsJson);
    setData([urls]);
  }, [replace]);

  return data;
}
