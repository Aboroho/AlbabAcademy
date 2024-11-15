export function excludeFields<T extends object, K extends keyof T>(
  obj: T | null | undefined,
  keysToExclude: K[],
  nullIfEmpty: boolean = true
): Omit<T, K> | null {
  if (obj === null || obj === undefined) {
    return null;
  }

  if (Object.entries(obj).length === 0 && nullIfEmpty) return null;

  // Create a shallow copy of the original object to avoid mutating the input
  const result = { ...obj };

  // Remove each key in the keysToExclude array from the result object
  keysToExclude.forEach((key) => {
    delete result[key];
  });

  // Return the new object without the excluded keys
  return result;
}

export function omitFields<T extends object, K extends keyof T>(
  obj: T,
  keysToExclude: K[]
): Omit<T, K> {
  // Create a shallow copy of the original object to avoid mutating the input
  const result = { ...obj };

  // Remove each key in the keysToExclude array from the result object
  keysToExclude.forEach((key) => {
    delete result[key];
  });

  // Return the new object without the excluded keys
  return result;
}
