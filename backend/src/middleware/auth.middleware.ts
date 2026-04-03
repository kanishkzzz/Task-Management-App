import { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";

const getTokenFromCookie = (cookieHeader?: string) => {
    if (!cookieHeader) {
        return undefined;
    }

    const tokenCookie = cookieHeader
        .split(";")
        .map((cookie) => cookie.trim())
        .find((cookie) => cookie.startsWith("token="));

    return tokenCookie?.split("=")[1];
};

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;
        const cookieToken = getTokenFromCookie(req.headers.cookie);

        if(!authHeader && !cookieToken) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader
            ? (authHeader.startsWith("Bearer ")
                ? authHeader.split(" ")[1]
                : authHeader)
            : cookieToken;

        if (!token) {
            return res.status(401).json({ message: "Invalid authorization header" });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string

        ) as unknown as { userId: string };

        (req as any).user = decoded;
        next();
    } catch (error) {
        if (error instanceof JsonWebTokenError) {
            return res.status(401).json({ message: "Invalid token" });
        }
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
