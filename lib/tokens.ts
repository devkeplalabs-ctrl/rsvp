import { nanoid } from "nanoid";

export function generateInviteToken(): string {
  return nanoid(24);
}

export function generatePublicSlug(): string {
  return nanoid(10);
}
