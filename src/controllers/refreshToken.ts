import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const refreshToken = (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as { id: string, role: string };

    const newAccessToken = jwt.sign(
      { id: payload.id,
        role: payload.role
      },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: "15m" } // 15 minutes is more reasonable than 15s
    );

    return res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error("Refresh token verification failed:", err);
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};