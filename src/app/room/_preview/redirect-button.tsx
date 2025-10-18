"use client";

import { useRouter } from "next/navigation";
import { getYoutubeVideos } from "@/api";
import Button from "@/components/button";
import { Youtube  } from "@/utils/helper-types";
import { useEffect } from "react";

type Props = {
  href: string;
  text: string;
};

export default function RedirectButton({ href, text }: Props) {
  useEffect(() => {
    document.cookie = "inside=false";
  }, [])
  const { replace } = useRouter();
  return <Button onClick={async () => {
    const youtubeObjects:Youtube[]= JSON.parse(localStorage.getItem("youtubeObjects") ?? "")
    const youtubeIds = youtubeObjects.map(youtube => youtube.videoId) 
    const videos = await getYoutubeVideos(youtubeIds)
    if(!videos) {
      alert("Error")
      return
    }
    console.log()
    if(videos.length !== youtubeIds.length){
      alert("Some Video Is downloading. Please wait few minutes and click again")
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
