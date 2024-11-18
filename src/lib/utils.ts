import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 *
 * @param file
 * @returns dataUrl
 */
export async function imageToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onerror = (error) => reject(error);
    fileReader.onload = () => resolve(fileReader.result as string);
  });
}

/**
 * @description generate query params from object
 * @example {a : 5, b : 6, c : 8} ---> 'a=5&b=6&c=8'
 */
export function generateQueryParamsFromObject(obj: object) {
  return Object.entries(obj || {})
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
}

/**
 * Number to words
 *
 */

const ones = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

const tens = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

export function numberToWords(num: number): string {
  const scales = ["", "Thousand", "Million", "Billion", "Trillion"];
  if (num === 0) return "Zero";

  let word = "";

  // Process each group of 3 digits, starting from the right (e.g. billion, million, thousand, etc.)
  for (let i = 0, unit = num; unit > 0; i++, unit = Math.floor(unit / 1000)) {
    const group = unit % 1000;
    if (group > 0) {
      word = `${convertThreeDigits(group)} ${scales[i]} ${word}`.trim();
    }
  }

  return word.trim();
}

function convertThreeDigits(num: number): string {
  let result = "";

  if (num >= 100) {
    result += `${ones[Math.floor(num / 100)]} Hundred `;
    num %= 100;
  }

  if (num >= 20) {
    result += `${tens[Math.floor(num / 10)]} `;
    num %= 10;
  }

  if (num > 0) {
    result += `${ones[num]} `;
  }

  return result.trim();
}

// months
export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

type FlattenedObject = { [key: string]: any };

export function flattenObject(
  obj: Record<string, any>,
  parentKey: string = "",
  result: FlattenedObject = {}
): FlattenedObject {
  for (const [key, value] of Object.entries(obj)) {
    const newKey = parentKey ? `${parentKey}_${key}` : key;

    if (value && typeof value === "object" && !Array.isArray(value)) {
      flattenObject(value, key, result); // Recursively flatten the nested object
    } else {
      result[newKey] = value; // Assign the value if it's a primitive or an array
    }
  }
  return result;
}
