import { randomUUID } from "crypto";

export function generateLinkId(): string {
  return randomUUID();
}
