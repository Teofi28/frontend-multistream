"use client";

import Button from "@/components/button";
import { Room } from "@/utils/helper-types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  text: string;
};

export default function RedirectButton({ text }: Props) {
  const router = useRouter();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const [loadingRooms, setLoadingRooms] = useState(true);

  const domainAPI =
    process.env.NEXT_PUBLIC_DOMAIN_API ??
    "http://127.0.0.1:8000/api";

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

  const enterRoom = () => {
    if (!selectedRoomId) {
      alert("Please select a room");
      return;
    }

    router.push(
      `/room?state=inside&roomId=${selectedRoomId}`
    );
  };

  return (
    <div className="flex gap-x-4">
      <select
        value={selectedRoomId}
        onChange={(event) =>
          setSelectedRoomId(
            event.target.value
          )
        }
        disabled={
          loadingRooms ||
          rooms.length === 0
        }
        className="bg-[#430B1E] text-white rounded-md p-4 flex-grow"
      >
        <option value="">
          {loadingRooms
            ? "Loading rooms..."
            : "Select Room to Enter"}
        </option>

        {rooms.map((room) => (
          <option
            key={room.id}
            value={room.id}
          >
            {room.name}
          </option>
        ))}
      </select>

      <Button
        type="button"
        onClick={enterRoom}
      >
        {text}
      </Button>
    </div>
  );
}