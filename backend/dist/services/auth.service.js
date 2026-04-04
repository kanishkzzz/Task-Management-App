"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAuthTokenService = exports.loginUserService = exports.registerUserService = void 0;
const prisma_1 = require("../lib/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const createJwtOptions = (expiresIn) => ({
    issuer: env_1.env.jwtIssuer,
    audience: env_1.env.jwtAudience,
    expiresIn: expiresIn,
});
const generateAuthToken = (userId) => jsonwebtoken_1.default.sign({ userId }, env_1.env.jwtSecret, createJwtOptions(env_1.env.jwtExpiresIn));
const generateRefreshToken = (userId) => jsonwebtoken_1.default.sign({ userId }, env_1.env.jwtRefreshSecret, createJwtOptions(env_1.env.jwtRefreshExpiresIn));
const toSafeUser = (user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
});
const registerUserService = async (data) => {
    const existingUser = await prisma_1.Prisma.user.findUnique({
        where: { email: data.email },
    });
    if (existingUser) {
        throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt_1.default.hash(data.password, 12);
    const user = await prisma_1.Prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
        },
    });
    const token = generateAuthToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    return {
        token,
        refreshToken,
        user: toSafeUser(user),
    };
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
    const token = generateAuthToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    return {
        token,
        refreshToken,
        user: toSafeUser(user),
    };
};
exports.loginUserService = loginUserService;
const refreshAuthTokenService = async (refreshToken) => {
    const decoded = jsonwebtoken_1.default.verify(refreshToken, env_1.env.jwtRefreshSecret, {
        issuer: env_1.env.jwtIssuer,
        audience: env_1.env.jwtAudience,
    });
    const token = generateAuthToken(decoded.userId);
    return { token };
};
exports.refreshAuthTokenService = refreshAuthTokenService;
//# sourceMappingURL=auth.service.js.map