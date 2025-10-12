type Props = {
  text: string;
};

export default function LabelBar({ text }: Props) {
  return <label className="font-bold text-white break-words">{text}</label>;
}
