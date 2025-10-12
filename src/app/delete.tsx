"use client";

import { useEffect } from "react";

export default function CleanLocalStorage() {
  useEffect(() => {
    localStorage.clear();
  }, []);
  return <></>;
}
