"use client";

import Button from "@/components/button";
import { Url} from "@/utils/helper-types";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function InputUrl() {
  const [urls, setUrls] = useState<Url[]>([]);
  const formRef = useRef<HTMLFormElement | null>(null)

  useEffect(() => {
    localStorage.setItem("urls", JSON.stringify(urls));
  }, [urls]);

  return (
    <>
      <form
        ref={formRef}
        action={async (form) => {
          if (typeof form === "string") return;
          const urlForm = form.get("url");
          if (!urlForm) return;
          const url = urlForm.toString()

          const id = uuidv4();
          setUrls((prev) => [...prev, { id: id, url: url.toString() }]);
          formRef.current?.reset()
        }}
      >
        <div className="flex gap-x-4">
          <input name="url" placeholder="Enter URL here" className="bg-[#430B1E] text-white rounded-md p-4 w-full" />
          <Button type="submit">Submit</Button>
        </div>
      </form>
      <div className="bg-[#430B1E] h-80 rounded-md overflow-y-scroll w-full">
        {urls.map(({ url, id }) => (
          <p className="text-white" key={id}>
            {url}
          </p>
        ))}
      </div>
    </>
  );
}
