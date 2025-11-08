import { jwt } from "twilio";
import { object, string } from "zod";

export function generateSignature(identity: string, room: string): string {
  const AccessToken = jwt.AccessToken;

  const VideoGrant = AccessToken.VideoGrant;

  const schema = object({
    twilioAccountSid: string(),
    twilioApiKey: string(),
    twilioApiSecret: string(),

  })

  const obj = schema.safeParse(process.env)
  if(!obj.success){
    console.error(obj.error)
    return ""
  }
  
  const {twilioAccountSid, twilioApiKey, twilioApiSecret} = obj.data

  const videoGrant = new VideoGrant({
    room,
  });

  const token = new AccessToken(twilioAccountSid, twilioApiKey, twilioApiSecret, { identity });
  token.addGrant(videoGrant);

  return token.toJwt();
}
