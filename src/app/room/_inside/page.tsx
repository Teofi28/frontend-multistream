import { generateSignature } from "@/utils/generate-token";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Room from "./room";

export default function InsideRoom() {
  const username = cookies().get("username")?.value;

  if (!username) redirect("/");
  return (
    <Room
      domainAPI={process.env.DOMAIN_API ?? ""}
      domainWebsocket={process.env.DOMAIN_WEBSOCKET ?? ""}
      domainSocketio={process.env.DOMAIN_SOCKETIO ?? ""}
      username={username}
      token={generateSignature(username, "test")}
    />
  );
}
