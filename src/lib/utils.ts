import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import katex from "katex";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitialsFromFullName(name: string) {
  const rgx = new RegExp(/(\p{L}{1})\p{L}+/, "gu");
  let initials = [...name.matchAll(rgx)] || [];
  return (initials.shift()?.[1] || "") + (initials.pop()?.[1] || "");
}

export function toTitleCase(title: string) {
  const smallWords =
    /^(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|vs?\.?|via)$/i;

  //return true if the given word should be uppercase
  function shouldBeUppercase(word: string, index: number, length: number) {
    //always capitalize the first and last words
    if (index == 0 || index == length - 1) return true;

    //only capitalize other words if they don't match the small words pattern
    return !smallWords.test(word.toLowerCase());
  }

  function convertFirstLetterToUpperCase(str: string) {
    //split into words
    const words = str?.split(" ");

    //change the case and rejoin into a string
    return words
      ?.map((word, index) =>
        shouldBeUppercase(word, index, length)
          ? word?.charAt(0)?.toUpperCase() + word?.slice(1)
          : word?.toLowerCase()
      )
      .join(" ");
  }

  return convertFirstLetterToUpperCase(title);
}

// export const latexToHTML = (latexString: string) =>
//   latexString?.replaceAll(/\\.*?}.*?}/g, (match) =>
//     katex.renderToString(match)
//   );

export const latexToHTML = (latexString: string) =>
  latexString.replace(
    /\\frac{(\w+)}{(\w+)}|(\w+)\^(\w+)/g,
    (match, num1, num2, base, exponent) => {
      if (num1 && num2) {
        // Handling \frac{num1}{num2}
        return `(${num1}/${num2})`;
      } else if (base && exponent) {
        // Handling x^y
        return `${base}<sup>${exponent}</sup>`;
      }
      return match; // Fallback in case of unexpected match
    }
  );

// Best-effort cleanup for known artifacts in question/option payloads
export const formatQuizHtml = (raw: string | undefined | null): string => {
  if (!raw || typeof raw !== 'string') return '';
  let s = raw;
  // Fix currency artifacts like "₦}1,500" → "₦1,500"
  s = s.replace(/([₦$€£])\}/g, '$1');
  // Fix numeric artifacts like "2,!400" → "2,400" and "2,!700" → "2,700"
  s = s.replace(/(\d),(?:!)(\d{3})/g, '$1,$2');
  // Also handle any stray non-digit (rare) right after a thousands comma: "2,?400" → "2,400"
  s = s.replace(/(\d),[^0-9](\d{3})/g, '$1,$2');
  // Normalize Windows newlines
  s = s.replace(/\r\n/g, '\n');
  // Run basic LaTeX conversions
  s = latexToHTML(s);
  // Strip any script/style tags for safety
  s = s.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
  s = s.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '');
  // Remove inline event handlers like onclick="..."
  s = s.replace(/ on[a-z]+="[^"]*"/gi, '');
  return s;
};
