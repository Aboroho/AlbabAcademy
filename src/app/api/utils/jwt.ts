import { JWT_SECRET } from "@/lib/constants";
import jwt from "jsonwebtoken";

export const generateToken = (
  payload: string | object,
  options?: { expiresIn?: string }
) => {
  return jwt.sign(payload, JWT_SECRET, options);
};

export const generateAccessToken = (payload: string | object) => {
  return generateToken(payload, { expiresIn: "1h" });
};

export const generateRefreshToken = (payload: string | object) => {
  return generateToken(payload, { expiresIn: "7d" });
};

export const verifyToken = (token: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        reject(err);
      } else {
        resolve(user);
      }
    });
  });
};
