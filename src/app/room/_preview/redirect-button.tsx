"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/button";
import { useEffect } from "react";

type Props = {
  href: string;
  text: string;
};

export default function RedirectButton({ href, text }: Props) {
  useEffect(() => {
    document.cookie = "inside=false";
  }, [])
  const { replace } = useRouter();
  return <Button onClick={() => {
    replace(href)
  }}>{text}</Button>;
}
