import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button(props: Props) {
  const { type = "button" } = props;
  return (
    <button
      {...props}
      type={type}
      className={`bg-[#008001] text-white px-3 py-1 border-none rounded-md min-h-10 ${props.className}`}
    >
      {props.children}
    </button>
  );
}
