import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config";

interface AuthenticatedRequest extends Request {
  token?: string;
  userId?: string;
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  console.log(req.headers.authorization)
  if (!authHeader) {
    res.status(401).json({ message: "Unauthorized: Token missing" });
    return;
  }

  const token = authHeader;

  try {
    const decoded = jwt.verify(token as string, JWT_SECRET as string) as JwtPayload;

    // Optional chaining to safely access userId
    req.userId = (decoded as JwtPayload).userId ?? undefined;

    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
    return;
  }
};
