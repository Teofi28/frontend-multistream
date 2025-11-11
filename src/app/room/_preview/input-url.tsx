"use client";

import Button from "@/components/button";
import { Url} from "@/utils/helper-types";
import { useEffect, useRef, useState } from "react";

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
          const urlForm = form.get("url");
          const urlId = form.get("url-id")
          if (!urlForm || !urlId) return;
          const existId = urls.some(url => url.id === urlId.toString())
          if(existId){
            alert("Id has been added")
          }
          const url = urlForm.toString()
          const id = urlId.toString();
          setUrls((prev) => [...prev, { id: id, url: url.toString() }]);
          formRef.current?.reset()
        }}
      >
        <div className="flex gap-x-4">
          <input name="url" type="url" placeholder="Enter URL here" className="bg-[#430B1E] text-white rounded-md p-4 w-full" />
          <input name="url-id" placeholder="URL id" className="bg-[#430B1E] text-white rounded-md p-4 w-full" />
          <Button type="submit">Submit</Button>
        </div>
      </form>
      <table className="table-auto min-w-full table-auto border-collapse">
        <thead className="sticky top-0 bg-[#5C0F2A]">
          <tr>
            <th className="px-4 py-2 text-left text-white"> URL </th>
            <th className="px-4 py-2 text-center text-white"> Id </th>
          </tr>
        </thead>
        <tbody>
          {urls.map(({ url, id }) => (
            <tr className="text-white border-b border-[#5C0F2A]" key={id}>
              <td className="py-2">{url}</td>
              <td className="py-2 text-center">{id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
