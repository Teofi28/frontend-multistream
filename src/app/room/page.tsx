import { cookies } from "next/headers";
import InsideRoom from "./_inside";
import PreviewRoom from "./_preview";

export default function Page({ searchParams }: {
  searchParams: { state: string | string[] | undefined }
}){

  const state = searchParams.state;
  const data = cookies().get("inside")?.value
  if(!state || state === "preview" || data === "true"){
    return <PreviewRoom />
  }
  return <InsideRoom />

}
