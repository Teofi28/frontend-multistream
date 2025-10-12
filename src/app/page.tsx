import RedirectFeedbackButton from "@/components/button/redirect-feedback-button";
import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import Button from "../components/button";
import CleanLocalStorage from "./delete";

export default function Page() {
  const login = async (form: FormData) => {
    "use server";
    const username = form.get("username");
    if (!username) throw Error("Username can not be empty");
    cookies().set("username", username.toString(), { httpOnly: true });
    redirect("/preview-room");
  };

  return (
    <main className="p-1 flex-grow flex flex-col gap-y-10 xl:flex-row xl:gap-x-5 xl:h-full">
      <CleanLocalStorage />
      <section className="flex flex-col items-center gap-y-2">
        <div className="flex justify-center ">
          <Image
            src="/logo.jpg"
            width={1080}
            height={841}
            alt="logo.jpg"
            className="w-[150px]"
          />
        </div>
        <div className="flex flex-col gap-y-1 xl:flex-grow xl:py-10">
          <Button>Body Training and Health</Button>
          <Button>Security Cameras</Button>
          <Button>Products</Button>
          <Button>Design & Services</Button>
          <Button>IOT Devices</Button>
          <Button>Social Netwoks</Button>
        </div>
        <RedirectFeedbackButton />
      </section>

      <div className="flex flex-col gap-y-28 2xl:flex-grow 2xl:items-center 2xl:pt-16">
        <section className="flex flex-col  items-center gap-y-14  2xl:flex-row 2xl:justify-center 2xl:gap-x-6">
          <h1 className="text-white font-bold text-center text-[30px]">
            Artificial Intelligence Applied on Live Video Streaming for All
            Purposes
          </h1>
          <Image
            src={"/stream.jpg"}
            width={668}
            height={360}
            alt="live-image"
            className="animate-spin w-[150px]"
          />
        </section>
        <div className="flex justify-center">
          <form action={login} className="grid grid-cols-1 gap-y-2">
            <input placeholder="username" name="username" required />
            <Button type="submit">Ingresar</Button>
          </form>
        </div>
      </div>
    </main>
  );
}
