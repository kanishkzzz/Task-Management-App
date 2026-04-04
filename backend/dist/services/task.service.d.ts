type GetTasksOptions = {
    userId: string;
    page: number;
    limit: number;
    status?: boolean;
    search?: string;
};
export declare const createTaskService: (userId: string, data: {
    title: string;
    description?: string;
}) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string | null;
    status: boolean;
    userId: string;
}>;
export declare const getTasksService: ({ userId, page, limit, status, search, }: GetTasksOptions) => Promise<{
    tasks: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        status: boolean;
        userId: string;
    }[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}>;
export declare const updateTaskService: (taskId: string, userId: string, data: {
    title?: string;
    description?: string;
    status?: boolean;
}) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string | null;
    status: boolean;
    userId: string;
}>;
export declare const deleteTaskService: (taskId: string, userId: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string | null;
    status: boolean;
    userId: string;
}>;
export declare const toggleTaskStatusService: (taskId: string, userId: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string | null;
    status: boolean;
    userId: string;
}>;
export {};
//# sourceMappingURL=task.service.d.ts.map