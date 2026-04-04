import { NextFunction, Request, Response } from "express";
export declare const createTask: (req: Request, res: Response, _next: NextFunction) => Promise<Response<any, Record<string, any>>>;
export declare const getTasks: (req: Request, res: Response, _next: NextFunction) => Promise<Response<any, Record<string, any>>>;
export declare const updateTask: (req: Request, res: Response, _next: NextFunction) => Promise<Response<any, Record<string, any>>>;
export declare const toggleTaskStatus: (req: Request, res: Response, _next: NextFunction) => Promise<Response<any, Record<string, any>>>;
export declare const deleteTask: (req: Request, res: Response, _next: NextFunction) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=task.controller.d.ts.map