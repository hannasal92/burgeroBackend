import { Request, Response } from "express";
import { UserModel } from "../models/User";
import bcrypt from "bcrypt";

export const addUser = async (req: Request, res: Response) => {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password || !phone){
       return res.status(400).json({ error: "All fields required" });
    }

    try {
        let user = await UserModel.findOne({ email });
        if(user){
            return res.json({ message: "user already exist" });
        }
            // Register new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserModel.create({name, email, phone, password: hashedPassword });
        return res.status(201).json({
        message: "User created successfully",
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to add user" });
    }
};