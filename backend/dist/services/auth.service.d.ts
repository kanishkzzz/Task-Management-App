export declare const registerUserService: (data: {
    name: string;
    email: string;
    password: string;
}) => Promise<{
    token: string;
    user: {
        name: string;
        id: string;
        email: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    };
}>;
export declare const loginUserService: (data: {
    email: string;
    password: string;
}) => Promise<{
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}>;
//# sourceMappingURL=auth.service.d.ts.map