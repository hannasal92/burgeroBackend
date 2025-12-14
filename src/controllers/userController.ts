import { Request, Response } from "express";
import { UserModel } from "../models/User";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/tokens";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export const addUser = async (req: Request, res: Response) => {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password || !phone){
       return res.status(400).json({ error: "All fields required" });
    }

    try {
        let user = await UserModel.findOne({ email });
        if(user){
            return res.status(409).json({
            message: "המשתמש נמצא במערכת",
            });
        }
            // Register new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserModel.create({name, email, phone, password: hashedPassword });
        return res.status(201).json({
        message: "המשתמש התווסף בהצלחה",
        });
    } catch (err) {
        res.status(500).json({ error: "שגיאה בהוספת המשתמש" });
    }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  try {
    let user = await UserModel.findOne({ email });
    if(!user){
        return res.status(404).json({ error: "המשתמש לא נמצא במערכת" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    const {name} = user ;

    if (!isMatch)
      return res.status(404).json({ error: "סיסמה שגויה" });

    const accessToken = generateAccessToken({ id: user._id });
    const refreshToken = generateRefreshToken({ id: user._id });
    console.log("accessToken "+accessToken)
    console.log("refreshToken "+refreshToken)

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ message: "התחברת בהצלחה", user : {email, name}, accessToken });
    

  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};


