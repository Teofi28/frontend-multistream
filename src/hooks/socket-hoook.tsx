import { info } from "@/utils/console-logs";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

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
  const [socket, setSocket] = useState<Socket | null>(null);
  useEffect(() => {
    if (!username) return;
    const connection = io(url);
    connection.on("connect", () => {
      info("SOCKET IO", username, "is connected");
      connection.emit("on_join", username);
      setSocket(connection);
    });
    connection.on("connect_error", () => {});
    connection.on("error", () => {});
    return () => {
      connection.close();
    };
  }, [url, username]);
  return socket;
}
