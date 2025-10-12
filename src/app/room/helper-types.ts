export type CustomLocalParticipant = {
  sid: string;
  username: string;
  audioStream?: MediaStreamTrack;
  stream?: MediaStreamTrack;
};
