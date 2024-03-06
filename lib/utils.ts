import { type ClassValue, clsx } from "clsx";
import { nanoid } from "nanoid";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getId() {
  return nanoid();
}


export function createBlobUrl(args: { folder: string; id: string }) {
  const path = args.id || getId();

  return `covers/${path}`;
}
