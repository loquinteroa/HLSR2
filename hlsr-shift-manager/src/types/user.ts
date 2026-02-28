import { Links } from "./link";

export interface user {
    id: string,
    name: string,
    email: string,
    links?: Links[],
    createdAt: Date,
}


export interface userState {
    loading: boolean;
    data: user;
    errors?: string;
}

export enum UserActionTypes {
    LOAD_USER = 'LOAD_USER',
    LOAD_USER_IN_PROGRESS = 'LOAD_USER_IN_PROGRESS',
    LOAD_USER_SUCCESS = 'LOAD_USER_SUCCESS',
    LOAD_USER_FAILURE = 'LOAD_USER_FAILURE'
}