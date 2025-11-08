import InputUrl from "./input-url";
import RedirectButton from "./redirect-button";

export default async function PreviewRoom() {
  return (
    <main className="flex justify-center items-center w-full h-full">
      <div className="w-[90%] md:w-[50%] gap-y-5 flex flex-col">
        <label className="text-3xl text-white">Add URL Stream</label>
        <InputUrl/>
        <RedirectButton href="/room?state=inside" text="Go Room" />
      </div>
    </main>
  );
}
