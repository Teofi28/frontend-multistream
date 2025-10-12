type Props = {
  text: string;
};

export default function QuestionLabel({ text }: Props) {
  return <label className="font-bold">{text}</label>;
}
