import { NextRequest } from "next/server";
import { APIError } from "./handleError";

export const parseFormData = async (req: NextRequest) => {
  try {
    const formdata = await req.formData();

    return formdata;
  } catch (err: unknown) {
    if (err instanceof TypeError) {
      throw new APIError("expecting form-data", 400);
    }
    throw new APIError("unknow error occured", 500);
  }
};

export const parseJSONData = async (req: NextRequest) => {
  try {
    const formdata = await req.json();

    return formdata;
  } catch (err: unknown) {
    console.log(err);
    if (err instanceof SyntaxError) {
      throw new APIError("JSON parse error! | valid json data expected", 400);
    }
    throw new APIError("unknow error occured", 500);
  }
};
