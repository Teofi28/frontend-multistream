import { useEffect, useState } from "react";

export function useWebSocket(url: string, user: string) {
  const [socket, setSocket] = useState<null | WebSocket>(null);
  useEffect(() => {
    setSocket(new WebSocket(url));
  }, [url, user]);
  return socket;
}
