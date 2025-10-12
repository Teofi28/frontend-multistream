"use client";

import { useRouter } from "next/navigation";
import Button from "./button";
import { getYoutubeVideos } from "@/api";

type Props = {
  href: string;
  text: string;
};

export default function RedirectButton({ href, text }: Props) {
  const { replace } = useRouter();
  return <Button onClick={async () => {
    const youtubeIds= JSON.parse(localStorage.getItem("youtubeIds") ?? "")
    const videos = await getYoutubeVideos(youtubeIds)
    if(!videos) {
      alert("Error")
      return
    }
    const isDownloading = videos.some(video => video.state === "downloading")
    if(isDownloading){
      alert("Some Video Is downloading. Please wait few minutes and click again")
      return
    }
    replace(href)
  }}>{text}</Button>;
}
