import Image from "next/image";
import Link from "next/link";

type Props = {
  containerClassName?: string;
  className?: string;
};

export default function RedirectFeedbackButton({
  className,
  containerClassName,
}: Props) {
  return (
    <Link href="/feedback" className={`flex ${containerClassName}`}>
      <Image
        alt="redirect feedback"
        src={"/feedback.png"}
        className={`${className}`}
        width={200}
        height={200}
      />
    </Link>
  );
}
