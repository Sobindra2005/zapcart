export type SystemSetting = {
    id: number;
    key: string;
    value?: string;
    description?: Record<string, any> | null;
    updatedAt: string;
    createdAt: string;
};