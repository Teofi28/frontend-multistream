"use client";

import Button from "@/components/button";
import { Room, Url } from "@/utils/helper-types";
import { useEffect, useRef, useState } from "react";

type CameraResponse = {
  id: number;
  hardware_id: string;
  rtsp_url: string;
  room_id: number;
  active: boolean;
};

export default function InputUrl() {
  const [urls, setUrls] = useState<Url[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingCameras, setLoadingCameras] = useState(true);

  const formRef = useRef<HTMLFormElement | null>(null);

  const domainAPI =
    process.env.NEXT_PUBLIC_DOMAIN_API ??
    "http://127.0.0.1:8000/api";

  /*
   * Load rooms from backend.
   */
  useEffect(() => {
    const loadRooms = async () => {
      try {
        setLoadingRooms(true);

        const response = await fetch(
          `${domainAPI}/rooms`
        );

        if (!response.ok) {
          throw new Error(
            `Unable to load rooms: ${response.status}`
          );
        }

        const data: Room[] =
          await response.json();

        setRooms(data);
      } catch (error) {
        console.error(
          "Error loading rooms:",
          error
        );

        alert(
          "Unable to load rooms from server"
        );
      } finally {
        setLoadingRooms(false);
      }
    };

    loadRooms();
  }, [domainAPI]);

  /*
   * Load all cameras from SQLite.
   *
   * Current backend API exposes:
   * GET /rooms/{room_id}/cameras
   *
   * So we query each existing room and combine
   * all cameras into one list.
   */
  useEffect(() => {
    if (loadingRooms) {
      return;
    }

    const loadAllCameras = async () => {
      try {
        setLoadingCameras(true);

        const camerasByRoom =
          await Promise.all(
            rooms.map(async (room) => {
              const response =
                await fetch(
                  `${domainAPI}/rooms/${room.id}/cameras`
                );

              if (!response.ok) {
                throw new Error(
                  `Unable to load cameras for room ${room.id}: ${response.status}`
                );
              }

              const cameras: CameraResponse[] =
                await response.json();

              return cameras.map(
                (camera): Url => ({
                  id: camera.hardware_id,
                  url: camera.rtsp_url,
                  roomId: camera.room_id,
                  roomName: room.name,
                })
              );
            })
          );

        const allCameras =
          camerasByRoom.flat();

        setUrls(allCameras);

        console.log(
          "[PREVIEW] Loaded cameras from database:",
          allCameras
        );
      } catch (error) {
        console.error(
          "Error loading cameras:",
          error
        );

        alert(
          "Unable to load cameras from server"
        );
      } finally {
        setLoadingCameras(false);
      }
    };

    loadAllCameras();
  }, [
    domainAPI,
    rooms,
    loadingRooms,
  ]);

  return (
    <>
      <form
        ref={formRef}
        action={async (form) => {
          const urlForm =
            form.get("url");

          const hardwareIdForm =
            form.get("url-id");

          const roomIdForm =
            form.get("room-id");

          if (
            !urlForm ||
            !hardwareIdForm ||
            !roomIdForm
          ) {
            alert(
              "Please complete all fields"
            );
            return;
          }

          const url =
            urlForm
              .toString()
              .trim();

          const id =
            hardwareIdForm
              .toString()
              .trim();

          const roomId =
            Number(roomIdForm);

          if (
            !url ||
            !id ||
            !roomId
          ) {
            alert(
              "Please complete all fields"
            );
            return;
          }

          const selectedRoom =
            rooms.find(
              (room) =>
                room.id === roomId
            );

          if (!selectedRoom) {
            alert("Invalid room");
            return;
          }

          try {
            const response =
              await fetch(
                `${domainAPI}/cameras`,
                {
                  method: "POST",

                  headers: {
                    "Content-Type":
                      "application/json",
                  },

                  body: JSON.stringify({
                    hardware_id: id,
                    rtsp_url: url,
                    room_id: roomId,
                  }),
                }
              );

            if (!response.ok) {
              let errorMessage =
                "Unable to create camera";

              try {
                const errorData =
                  await response.json();

                if (errorData.detail) {
                  errorMessage =
                    errorData.detail;
                }
              } catch {
                // Keep default message.
              }

              alert(errorMessage);
              return;
            }

            /*
             * Add the newly created camera
             * to the current table immediately.
             */
            setUrls((prev) => [
              ...prev,
              {
                id,
                url,
                roomId:
                  selectedRoom.id,
                roomName:
                  selectedRoom.name,
              },
            ]);

            formRef.current?.reset();
          } catch (error) {
            console.error(
              "Error creating camera:",
              error
            );

            alert(
              "Unable to connect to the server"
            );
          }
        }}
      >
        <div className="flex gap-x-4">
          <input
            name="url"
            type="url"
            placeholder="RTSP URL"
            required
            className="bg-[#430B1E] text-white rounded-md p-4 w-full"
          />

          <input
            name="url-id"
            placeholder="Hardware ID"
            required
            className="bg-[#430B1E] text-white rounded-md p-4 w-full"
          />

          <select
            name="room-id"
            required
            disabled={
              loadingRooms ||
              rooms.length === 0
            }
            defaultValue=""
            className="bg-[#430B1E] text-white rounded-md p-4 w-full"
          >
            <option
              value=""
              disabled
            >
              {loadingRooms
                ? "Loading rooms..."
                : "Select Room"}
            </option>

            {rooms.map(
              (room) => (
                <option
                  key={room.id}
                  value={room.id}
                >
                  {room.name}
                </option>
              )
            )}
          </select>

          <Button type="submit">
            Submit
          </Button>
        </div>
      </form>

      <table className="table-auto min-w-full border-collapse">
        <thead className="sticky top-0 bg-[#5C0F2A]">
          <tr>
            <th className="px-4 py-2 text-left text-white">
              RTSP URL
            </th>

            <th className="px-4 py-2 text-center text-white">
              Hardware ID
            </th>

            <th className="px-4 py-2 text-center text-white">
              Room
            </th>
          </tr>
        </thead>

        <tbody>
          {loadingCameras ? (
            <tr>
              <td
                colSpan={3}
                className="py-4 text-center text-white"
              >
                Loading cameras...
              </td>
            </tr>
          ) : urls.length === 0 ? (
            <tr>
              <td
                colSpan={3}
                className="py-4 text-center text-white"
              >
                No cameras registered
              </td>
            </tr>
          ) : (
            urls.map(
              ({
                url,
                id,
                roomId,
                roomName,
              }) => (
                <tr
                  className="text-white border-b border-[#5C0F2A]"
                  key={id}
                >
                  <td className="py-2">
                    {url}
                  </td>

                  <td className="py-2 text-center">
                    {id}
                  </td>

                  <td className="py-2 text-center">
                    {roomName} ({roomId})
                  </td>
                </tr>
              )
            )
          )}
        </tbody>
      </table>
    </>
  );
}