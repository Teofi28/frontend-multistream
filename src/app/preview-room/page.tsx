import RedirectButton from "@/components/button/redirect-button";
import InputUrl from "./input-url";
import SelectCamera from "./select-camera";
import SelectMicrophone from "./select-microphone";

export default async function PreviewRoom() {
  return (
    <main className="flex justify-center items-center w-full h-full">
      <div className="w-[90%] md:w-[50%] gap-y-5 flex flex-col">
        <section className="flex flex-col gap-y-1 md:gap-y-0 md:gap-x-2 md:flex-row ">
          <SelectCamera />
          <SelectMicrophone />
        </section>
        <section className="flex flex-col gap-y-3">
          <InputUrl/>
        </section>
        <RedirectButton href="/room" text="Go Room" />
      </div>
    </main>
  );
}
