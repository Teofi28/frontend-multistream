import InsideRoom from "./_inside";
import PreviewRoom from "./_preview";

export default function Page({
  searchParams,
}: {
  searchParams: {
    state?: string | string[];
    roomId?: string | string[];
  };
}) {
  const state = searchParams.state;
  const roomId = searchParams.roomId;

  if (
    !state ||
    state === "preview" ||
    !roomId
  ) {
    return <PreviewRoom />;
  }

  if (state === "inside") {
    return <InsideRoom />;
  }

  return <PreviewRoom />;
}