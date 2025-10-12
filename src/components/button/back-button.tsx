"use client";

import { useRouter } from "next/navigation";
import Button from "./button";

type Props = {
  url: string;
};
export default function BackButton({ url }: Props) {
  const { replace } = useRouter();
  return (
    <Button className="my-2" onClick={() => replace(url)}>
      Back
    </Button>
  );
}
