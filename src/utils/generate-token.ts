import { jwt } from "twilio";

export function generateSignature(identity: string, room: string): string {
  const AccessToken = jwt.AccessToken;

  const VideoGrant = AccessToken.VideoGrant;

  const twilioAccountSid = process.env.twilioAccountSid;
  const twilioApiKey = process.env.twilioApiKey;
  const twilioApiSecret = process.env.twilioApiSecret;

  const videoGrant = new VideoGrant({
    room,
  });

  const token = new AccessToken(twilioAccountSid, twilioApiKey, twilioApiSecret, { identity });
  token.addGrant(videoGrant);

  return token.toJwt();
}
