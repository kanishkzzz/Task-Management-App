"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.loginUser = exports.registerUser = void 0;
const auth_service_1 = require("../services/auth.service");
const error_middleware_1 = require("../middleware/error.middleware");
const env_1 = require("../config/env");
const authResponse = (message, payload) => ({
    success: true,
    message,
    data: payload,
});
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.toLowerCase());
const getCookieValue = (cookieHeader, name) => {
    if (!cookieHeader) {
        return undefined;
    }
    const cookie = cookieHeader
        .split(";")
        .map((value) => value.trim())
        .find((value) => value.startsWith(`${name}=`));
    return cookie?.slice(name.length + 1);
};
const setAuthCookies = (res, token, refreshToken) => {
    const sharedOptions = {
        httpOnly: true,
        sameSite: "lax",
        secure: env_1.env.nodeEnv === "production",
    };
    res.cookie("token", token, {
        ...sharedOptions,
        maxAge: 60 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
        ...sharedOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};
const registerUser = async (req, res, _next) => {
    const { name, email, password } = req.body;
    if (typeof name !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string") {
        throw new error_middleware_1.HttpError(400, "name, email and password are required");
    }
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedName.length < 2 || normalizedName.length > 100) {
        throw new error_middleware_1.HttpError(400, "name must be between 2 and 100 characters");
    }
    if (!isValidEmail(normalizedEmail)) {
        throw new error_middleware_1.HttpError(400, "email is invalid");
    }
    if (password.length < 8 || password.length > 72) {
        throw new error_middleware_1.HttpError(400, "password must be between 8 and 72 characters");
    }
    const result = await (0, auth_service_1.registerUserService)({
        name: normalizedName,
        email: normalizedEmail,
        password,
    });
    setAuthCookies(res, result.token, result.refreshToken);
    return res
        .status(201)
        .json(authResponse("User registered successfully", {
        accessToken: result.token,
        refreshToken: result.refreshToken,
        user: result.user,
    }));
};
exports.registerUser = registerUser;
const loginUser = async (req, res, _next) => {
    const { email, password } = req.body;
    if (typeof email !== "string" || typeof password !== "string") {
        throw new error_middleware_1.HttpError(400, "email and password are required");
    }
    const normalizedEmail = email.trim().toLowerCase();
    if (!isValidEmail(normalizedEmail)) {
        throw new error_middleware_1.HttpError(400, "email is invalid");
    }
    if (password.length < 8 || password.length > 72) {
        throw new error_middleware_1.HttpError(400, "password is invalid");
    }
    const result = await (0, auth_service_1.loginUserService)({ email: normalizedEmail, password });
    setAuthCookies(res, result.token, result.refreshToken);
    return res.status(200).json(authResponse("Login successful", {
        accessToken: result.token,
        refreshToken: result.refreshToken,
        user: result.user,
    }));
};
exports.loginUser = loginUser;
const refreshToken = async (req, res, _next) => {
    const refreshTokenFromBody = typeof req.body?.refreshToken === "string" ? req.body.refreshToken : undefined;
    const refreshTokenCookie = getCookieValue(req.headers.cookie, "refreshToken");
    const refreshTokenValue = refreshTokenFromBody ?? refreshTokenCookie;
    if (!refreshTokenValue) {
        throw new error_middleware_1.HttpError(401, "refresh token is required");
    }
    const result = await (0, auth_service_1.refreshAuthTokenService)(refreshTokenValue);
    res.cookie("token", result.token, {
        httpOnly: true,
        sameSite: "lax",
        secure: env_1.env.nodeEnv === "production",
        maxAge: 60 * 60 * 1000,
    });
    return res.status(200).json({
        success: true,
        message: "Token refreshed successfully",
        data: {
            accessToken: result.token,
        },
    });
};
exports.refreshToken = refreshToken;
//# sourceMappingURL=auth.controller.js.map