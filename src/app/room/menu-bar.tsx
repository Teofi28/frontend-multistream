import RedirectFeedbackButton from "@/components/button/redirect-feedback-button";
import { toInteger } from "lodash";
import Image from "next/image";
import { useState } from "react";
import { Socket } from "socket.io-client";
import LabelBar from "./label-bar";

type Props = {
  socket: Socket;
  username: string;
};

export default function MenuBar({ socket, username }: Props) {
  const [ids, setIds] = useState<string>("");
  const [objetivo, setObjetivo] = useState<string>("");
  const [input1, setInput1] = useState<string>("");
  const [input2, setInput2] = useState<string>("");
  const [stepSize, setStepSize] = useState<string>("");
  const [user, setUser] = useState<string>("");

  const sendAllData = (direction: string) => {
    socket.emit("on_direction", {
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
      <div className="bg-[#24221b] border-[4px] gap-y-2 border-orange-700 rounded-2xl  text-white  p-3 flex flex-col  h-1px flex-grow md:h-max overflow-y-scroll">
        <LabelBar text={`User Id: ${username}`} />
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
          <LabelBar text="Usuario Id" />
          <input className="border-[2px] text-black rounded-xl border-orange-500" onChange={(event) => setUser(event.target.value)} placeholder="idMark" />
        </div>
        <div className="flex flex-col">
          <LabelBar text="Ids" />
          <input className="text-black border-[2px] rounded-xl border-orange-500" value={ids} onChange={(ev) => setIds(ev.target.value)} placeholder="ids" />
          <button
            onClick={() => {
              socket.emit("on_box", {
                user,
                trackIds: ids.split(",").map(toInteger),
              });
              setIds("");
            }}
          >
            Go
          </button>
        </div>
        <RedirectFeedbackButton className="w-full" />
      </div>
    </div>
  );
}
