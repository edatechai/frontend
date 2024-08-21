import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitialsFromFullName(name: string) {
  const rgx = new RegExp(/(\p{L}{1})\p{L}+/, "gu");
  let initials = [...name.matchAll(rgx)] || [];
  return (initials.shift()?.[1] || "") + (initials.pop()?.[1] || "");
}
