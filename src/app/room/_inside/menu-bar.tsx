import { toInteger } from "lodash";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import LabelBar from "./label-bar";
import { Url } from "@/utils/helper-types";

type Props = {
  socket: Socket;
  username: string;
  roomId: string;
  urls: Url[];
  logs: string[];
};

export default function MenuBar({ socket, username,roomId,urls,logs }: Props) {
  const [ids, setIds] = useState<string>("");
  const [objetivo, setObjetivo] = useState<string>("");
  const [input1, setInput1] = useState<string>("");
  const [input2, setInput2] = useState<string>("");
  const [stepSize, setStepSize] = useState<string>("1");
  const [user, setUser] = useState<string>("");

  const roomName =
    urls.length > 0
      ? urls[0].roomName
      : `Room ${roomId}`;

  useEffect(() => {
    if (urls.length === 0) {
      setUser("");
      return;
    }

    const userExistsInRoom = urls.some(
      (item) => item.id === user
    );

    if (!userExistsInRoom) {
      setUser(urls[0].id);
    }
  }, [urls, user]);

  const sendAllData = (direction: string) => {
    if (!user) {
      alert("Please select a hardware device");
      return;
    }
    socket.emit("on_direction", {
      roomId,
      user,
      value: {
        objetivo,
        input1,
        input2,
        stepSize,
        direction,
      },
    });
  };

  return (
    <div className="flex flex-col max-w-[30%] md:max-w-[22%]">
      <div className="bg-[#24221b] border-[4px] gap-y-2 border-orange-700 rounded-2xl  text-white  p-3 flex flex-col  h-1px md:h-max">
        <LabelBar text={`User Id: ${username}`} />

        <div className="border-b border-orange-700 pb-2 mb-1">
          <LabelBar text={`Room: ${roomName}`} />
          <p className="text-xs text-gray-300">
            Room ID: {roomId}
          </p>
        </div>

        <div className="flex flex-col gap-y-1">
          <LabelBar text="Hardware Devices" />

          {urls.length === 0 ? (
            <p className="text-sm text-gray-400">
              No devices in this room
            </p>
          ) : (
            urls.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setUser(item.id)}
                className={`text-left px-2 py-1 rounded-md border ${
                  user === item.id
                    ? "bg-orange-600 border-orange-300 text-white"
                    : "bg-[#3a372e] border-gray-600 text-white"
                }`}
              >
                {user === item.id ? "● " : "○ "}
                {item.id}
              </button>
            ))
          )}
        </div>

        <LabelBar text="Goal 1" />
        <input
          className="border-[2px] rounded-xl border-orange-500 text-black"
          onChange={(event) => setObjetivo(event.target.value)}
          placeholder="id Number"
        />
        <div className="flex flex-row">
          <button>Add</button>
          <button>Off</button>
        </div>
        <div className="flex flex-col">
          <LabelBar text="Input1" />
          <input
            className="border-[2px] rounded-xl border-orange-500 text-black"
            onChange={(event) => setInput1(event.target.value)}
            placeholder="Enter text for input"
          />
        </div>
        <div className="flex flex-col">
          <LabelBar text="Input2" />
          <input
            className="border-[2px] rounded-xl border-orange-500 text-black"
            onChange={(event) => setInput2(event.target.value)}
            placeholder="Enter text for input"
          />
        </div>
        <div className="mb-2 flex flex-col">
          <LabelBar text="Step Size" />
          <select className="border-[1px] rounded-xl border-orange-500 text-black" onChange={(event) => setStepSize(event.target.value)}>
            <option>1</option>
            <option>5</option>
            <option>10</option>
            <option>15</option>
          </select>
        </div>
        <div className="flex flex-col">
          <button onClick={() => sendAllData("UP")} className="flex justify-center">
            <Image src={"/arrow.png"} width={40} height={40} alt="" />
          </button>
          <div className="flex flex-row justify-center">
            <button onClick={() => sendAllData("LEFT")}>
              <Image src={"/arrow.png"} width={40} height={40} alt="" className="-rotate-90" />
            </button>
            <button
              onClick={() => {
                sendAllData("center");
              }}
              className="p-2"
            > 
              <Image src={"/enter.png"} width={30} height={30} alt="" />
            </button>
            <button onClick={() => sendAllData("RIGHT")}>
              <Image src={"/arrow.png"} width={40} height={40} alt="" className="rotate-90" />
            </button>
          </div>
          <button onClick={() => sendAllData("BOTTOM")} className="flex justify-center">
            <Image src={"/arrow.png"} width={40} height={40} alt="" className="rotate-180" />
          </button>
        </div>
        <div className="flex flex-col">
          <LabelBar text="Ids" />
          <input className="text-black border-[2px] rounded-xl border-orange-500" value={ids} onChange={(ev) => setIds(ev.target.value)} placeholder="ids" />
          <button
            onClick={() => {
              if (!user) {
                alert("Please select a hardware device");
                return;
              }

              const trackIds =
                ids === "all"
                  ? "all"
                  : ids.split(",").map(toInteger);

              socket.emit("on_box", {
                roomId,
                user,
                trackIds,
              });

              setIds("");
            }}
          >
            Go
          </button>
        </div>
        <div className="bg-white h-52 overflow-y-scroll">
        {logs.map((log, index) => <p className="text-black break-all text-sm border-black border-b-[1px]" key={index}>{log}</p>)}
        </div>
      </div>
    </div>
  );
}
