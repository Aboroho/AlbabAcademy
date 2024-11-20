import { NextRequest } from "next/server";

export function getQueryParamsAsObject(req: NextRequest): Record<string, any> {
  // Extract query parameters from the request URL
  const url = new URL(req.url);
  const queryParams = new URLSearchParams(url.search);

  const queryObject: Record<string, any> = {};

  // Loop through all query parameters and process them
  queryParams.forEach((value, key) => {
    // Check if the value is comma-separated and convert it to an array
    if (value.includes(",")) {
      queryObject[key] = value.split(",").map((item) => item.trim());
    } else {
      queryObject[key] = value;
    }
  });

  return queryObject;
}
