export declare const registerUserService: (data: {
    name: string;
    email: string;
    password: string;
}) => Promise<{
    token: string;
    refreshToken: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}>;
export declare const loginUserService: (data: {
    email: string;
    password: string;
}) => Promise<{
    token: string;
    refreshToken: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}>;
export declare const refreshAuthTokenService: (refreshToken: string) => Promise<{
    token: string;
}>;
//# sourceMappingURL=auth.service.d.ts.map