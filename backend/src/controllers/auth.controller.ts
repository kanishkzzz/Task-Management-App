import { Request, Response } from "express";
import { registerUserService } from "../services/auth.service";
import { loginUserService } from "../services/auth.service";

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await registerUserService({ name, email, password });

        return res.status(201).json({ message: "User registered successfully", user });
    } catch (error: any) {
        console.error("Error registering user:", error);
        return res.status(500).json({ message: error.message });
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and Password are required"
            })
        }

        const result = await loginUserService({ email, password });

        res.cookie("token", result.token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: "Login Successful",
            ...result
        })

    } catch (error: any) {
        if (error.message === "INVALID_CREDENTIALS") {
            return res.status(401).json({
                message: "Invalid email or Password"
            })
        }
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}
