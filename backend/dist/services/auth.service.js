"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserService = exports.registerUserService = void 0;
const prisma_1 = require("../lib/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const registerUserService = async (data) => {
    const existingUser = await prisma_1.Prisma.user.findUnique({
        where: { email: data.email },
    });
    //If User already exists, throw an error
    if (existingUser) {
        throw new Error("User already exists");
    }
    //hash Password
    const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
    //Create User
    const user = await prisma_1.Prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
        },
    });
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return { token, user };
};
exports.registerUserService = registerUserService;
const loginUserService = async (data) => {
    const user = await prisma_1.Prisma.user.findUnique({
        where: { email: data.email },
    });
    if (!user) {
        throw new Error("INVALID_CREDENTIALS");
    }
    const isPasswordValid = await bcrypt_1.default.compare(data.password, user.password);
    if (!isPasswordValid) {
        throw new Error("INVALID_CREDENTIALS");
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        }
    };
};
exports.loginUserService = loginUserService;
//# sourceMappingURL=auth.service.js.map