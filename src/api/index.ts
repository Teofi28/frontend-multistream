"use server"

const domainApi = process.env.DOMAIN_API ?? "";

type Video = {
    video_id: string,
    url: string,
    state: "downloaded" | "downloading",
    path: string
}

export async function getYoutubeVideos(videoIds:string[]):Promise<Video[] | undefined>{      
    const query = videoIds.map(id => "video_ids="+id)
    const response = await fetch(domainApi + "/youtube?"+query.join("&"), {
      method: "GET",
      headers:{
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) return ;
    return await response.json()
}

export async function generateYoutubeVideo (url:string)  {
  "use server";

  const response = await fetch(domainApi + "/youtube/download", {
    method: "post",
    headers:{
      "Content-Type": "application/json"
    },
    body: JSON.stringify({url}),
  });
  if (!response.ok) return ;
  const body = await response.json()
  return body.video_id
};
