"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const auth_service_1 = require("../services/auth.service");
const auth_service_2 = require("../services/auth.service");
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await (0, auth_service_1.registerUserService)({ name, email, password });
        return res.status(201).json({ message: "User registered successfully", user });
    }
    catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ message: error.message });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and Password are required"
            });
        }
        const result = await (0, auth_service_2.loginUserService)({ email, password });
        res.cookie("token", result.token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 1000,
        });
        return res.status(200).json({
            message: "Login Successful",
            ...result
        });
    }
    catch (error) {
        if (error.message === "INVALID_CREDENTIALS") {
            return res.status(401).json({
                message: "Invalid email or Password"
            });
        }
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
exports.loginUser = loginUser;
//# sourceMappingURL=auth.controller.js.map