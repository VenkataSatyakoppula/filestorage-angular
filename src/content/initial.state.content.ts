import { FileItem, FileItems, UserState } from "../models/file.model";
import { User } from "../models/user.model";


export const fileItemsInit :FileItems = {
    files: [],
    isLoading: false,
}

export const userInit: UserState = {
    user: {},
    isLoading: false,
}