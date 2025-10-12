type Props = {
  name: string;
};

export default function TextArea({ name }: Props) {
  return <textarea className="text-black border-black" name={name} rows={4} required cols={50}></textarea>;
}
