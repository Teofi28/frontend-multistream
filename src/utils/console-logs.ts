import { lowerCase } from "lodash";

function buildLog(base: string, ...logs: string[]) {
  return `[${base.toUpperCase()}]: ${logs.map(lowerCase).join(" ")}`;
}

export function info(base: string, ...logs: string[]) {
  console.info(buildLog(base, ...logs));
}

export function error(base: string, ...logs: string[]) {
  console.error(buildLog(base, ...logs));
}

export function webrtcInfo(...logs: any[]) {
  info("WEB RTC", ...logs);
}
export function webrtcError(...logs: any[]) {
  error("WEB RTC", ...logs);
}

export function twilioInfo(...logs: any[]) {
  info("TWILIO INFO", ...logs);
}
export function twilioError(...logs: any[]) {
  error("TWILIO INFO", ...logs);
}
