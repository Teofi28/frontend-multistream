import { HTMLProps } from "react";

type Option = {
  value: string | number;
  label: string;
};

type Props = {
  options: Option[];
  classNameContainer?: string;
  onChangeOption?: (arg: Option) => void;
  putNoneByDefault?: boolean;
} & HTMLProps<HTMLSelectElement>;

export default function Select({
  options,
  classNameContainer,
  onChangeOption,
  onChange,
  putNoneByDefault = true,
  ...props
}: Props) {
  return (
    <div className={"w-full " + classNameContainer}>
      <select
        className="w-full text-white outline-none border-0 p-4 bg-[#430B1E] rounded-md"
        onChange={(event) => {
          if (!onChangeOption) return onChange?.(event);
          const option = options.find(
            (option) => option.value === event.target.value,
          );
          if (!option) return;
          onChangeOption(option);
        }}
        {...props}
      >
        {putNoneByDefault && <option>Select a Value</option>}
        {options.map((option) => (
          <option
            key={option.value}
            className="bg-[#430B1E] text-white border-0"
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
