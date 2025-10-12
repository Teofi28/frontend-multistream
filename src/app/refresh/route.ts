import { generateSignature } from "@/utils/generate-token";

export async function POST(request: Request) {
  return request.json().then((body) => Response.json({ token: generateSignature(body.identity, body.room) }));
}
