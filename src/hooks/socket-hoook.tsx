import { info } from "@/utils/console-logs";
import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

export default function useSocket(url: string) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    try {
      const newSocket = new WebSocket(url);
      setSocket(newSocket);
    } catch {}
  }, [url]);

  return socket;
}

export function useSocketIo(url: string, username: string) {
  const socket = useMemo(() => io(url, {autoConnect: false}), [url])
  useEffect(() => {
    if (!username) return;
    socket.on("connect", () => {
      info("SOCKET IO", username, "is connected");
      socket.emit("on_join", username);
    });
    socket.connect()
    return () => {
      socket.off("connect")
      socket.close();
    };
  }, [url, username, socket]);
  return socket;
}
