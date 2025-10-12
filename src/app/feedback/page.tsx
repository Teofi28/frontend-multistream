import Button from "@/components/button";
import BackButton from "@/components/button/back-button";
import { redirect } from "next/navigation";
import QuestionLabel from "./question-label";
import TextArea from "./text-area";

export default function Page() {
  const domainApi = process.env.DOMAIN_API ?? "";
  const sendEmail = async (form: FormData) => {
    "use server";

    const response = await fetch(domainApi + "/feedback", {
      method: "post",
      body: form,
    });
    if (!response.ok) return {};
    redirect("/");
  };

  return (
    <form className="bg-[#4a1a2c] text-white grid grid-cols-2 gap-3 p-5 my-5 mx-[2%] lg:mx-[20%]" action={sendEmail}>
      <h1 className="font-bold text-center text-5xl col-span-full">GIVE FEEDBACK</h1>

      <QuestionLabel text="Fullname" />
      <input required name="fullname" />

      <QuestionLabel text="Email" />
      <input required name="email" type="email" />

      <QuestionLabel text="Comments" />
      <TextArea name="comments" />

      <Button className="my-2" type="submit">
        Submit
      </Button>
      <BackButton url="/" />
    </form>
  );
}
