import { NextFunction, Request, Response } from "express";
export declare const registerUser: (req: Request, res: Response, _next: NextFunction) => Promise<Response<any, Record<string, any>>>;
export declare const loginUser: (req: Request, res: Response, _next: NextFunction) => Promise<Response<any, Record<string, any>>>;
export declare const refreshToken: (req: Request, res: Response, _next: NextFunction) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=auth.controller.d.ts.map