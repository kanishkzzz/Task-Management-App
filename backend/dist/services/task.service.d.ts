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
//# sourceMappingURL=task.service.d.ts.map