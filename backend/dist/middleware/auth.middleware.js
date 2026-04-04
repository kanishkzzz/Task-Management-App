"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const error_middleware_1 = require("./error.middleware");
const env_1 = require("../config/env");
const getTokenFromCookie = (cookieHeader) => {
    if (!cookieHeader) {
        return undefined;
    }
    const tokenCookie = cookieHeader
        .split(";")
        .map((cookie) => cookie.trim())
        .find((cookie) => cookie.startsWith("token="));
    return tokenCookie?.split("=")[1];
};
const getTokenFromRequest = (req) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        if (!authHeader.startsWith("Bearer ")) {
            throw new error_middleware_1.HttpError(401, "Malformed authorization header");
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            throw new error_middleware_1.HttpError(401, "Token is required");
        }
        return token;
    }
    return getTokenFromCookie(req.headers.cookie);
};
const authMiddleware = (req, _res, next) => {
    try {
        const token = getTokenFromRequest(req);
        if (!token) {
            return next(new error_middleware_1.HttpError(401, "No token provided"));
        }
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.jwtSecret, {
            issuer: env_1.env.jwtIssuer,
            audience: env_1.env.jwtAudience,
        });
        const userId = decoded.userId;
        if (typeof userId !== "string") {
            return next(new error_middleware_1.HttpError(401, "Invalid token payload"));
        }
        req.user = { userId };
        return next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            return next(new error_middleware_1.HttpError(401, "Token expired"));
        }
        if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
            return next(new error_middleware_1.HttpError(401, "Invalid token"));
        }
        return next(error);
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map