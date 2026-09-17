import { Room, Url } from "@/utils/helper-types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type CameraResponse = {
  id: number;
  hardware_id: string;
  rtsp_url: string;
  room_id: number;
  active: boolean;
};

type Data = [Url[], string];

export default function useRoomCameras(
  domainAPI: string
): Data {
  const [data, setData] = useState<Data>([[], ""]);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const roomIdFromUrl =
      searchParams.get("roomId");

    if (!roomIdFromUrl) {
      router.replace("/room");
      return;
    }

    const numericRoomId =
      Number(roomIdFromUrl);

    if (
      !Number.isInteger(numericRoomId) ||
      numericRoomId <= 0
    ) {
      router.replace("/room");
      return;
    }

    const abortController =
      new AbortController();

    const loadRoomCameras = async () => {
      try {
        /*
         * Load cameras belonging to this room.
         */
        const camerasResponse =
          await fetch(
            `${domainAPI}/rooms/${numericRoomId}/cameras`,
            {
              signal:
                abortController.signal,
            }
          );

        if (!camerasResponse.ok) {
          throw new Error(
            `Unable to load cameras: ${camerasResponse.status}`
          );
        }

        const cameras: CameraResponse[] =
          await camerasResponse.json();

        /*
         * Load rooms so we can obtain
         * the human-readable room name.
         */
        const roomsResponse =
          await fetch(
            `${domainAPI}/rooms`,
            {
              signal:
                abortController.signal,
            }
          );

        if (!roomsResponse.ok) {
          throw new Error(
            `Unable to load rooms: ${roomsResponse.status}`
          );
        }

        const rooms: Room[] =
          await roomsResponse.json();

        const selectedRoom =
          rooms.find(
            (room) =>
              room.id === numericRoomId
          );

        if (!selectedRoom) {
          throw new Error(
            `Room ${numericRoomId} does not exist`
          );
        }

        /*
         * Convert backend Camera objects
         * into the Url format already used
         * by Room, WebRTC and MenuBar.
         */
        const urls: Url[] =
          cameras.map((camera) => ({
            id: camera.hardware_id,
            url: camera.rtsp_url,
            roomId: camera.room_id,
            roomName:
              selectedRoom.name,
          }));

        console.log(
          "[ROOM] Loaded cameras from database:",
          urls
        );

        setData([
          urls,
          roomIdFromUrl,
        ]);
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error(
          "Error loading room cameras:",
          error
        );

        alert(
          "Unable to load cameras from server"
        );
      }
    };

    loadRoomCameras();

    return () => {
      abortController.abort();
    };
  }, [
    domainAPI,
    router,
    searchParams,
  ]);

  return data;
}