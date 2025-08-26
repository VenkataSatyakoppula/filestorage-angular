import { User } from "./user.model";

export interface FileItem {
    name?: string;
    extension?: string;
    fileId: Number;
    fileName: string;
    filePath: string;
    userId: Number;
    fileSize: string;
    createdAt: string;
    fileType: string;
}

export interface FileItems {
    files: FileItem[];
    isLoading: boolean;
}

export interface UserState {
    user: Partial<User>;
    isLoading: boolean;
}