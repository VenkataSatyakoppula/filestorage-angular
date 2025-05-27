import { LoginResponse } from "./login.response.model";

export interface SignUpResponse {
    id:number;
    email: string;
    name:string;
    credentials: LoginResponse;
}