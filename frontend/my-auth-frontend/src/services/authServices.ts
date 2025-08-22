import API from "./api";
import type { RenewPasswordPayload, LoginPayload, SignupPayload, AuthResponse } from "../types";


//signup service
export const signup = async (payload : SignupPayload) : Promise<any> => {
    
    
    const response = await API.post<AuthResponse>('/authentication/register', payload);
    console.log(response);
   
    return response.data;
}

//login service
export const login = async (payload : LoginPayload) => {
    const response = await API.post<AuthResponse>('/authentication/login', payload);
    return response.data;
}

//verify user
export const verifyUser = async (token : string) => {
    const response = await API.post<AuthResponse>('/authentication/verify_user', null, {
        headers : {Authorization : `Bearer ${token}`}
    });
    return response.data;
}

//forgot password
export const forgotPassword = async (email: string) => {
    const response = await API.post<AuthResponse>('/authentication/forgot_password', email);
    return response.data;
}

//logout
export const logout = async () => {
    const response = await API.post<AuthResponse>('/authentication/logout');
    return response.data;
}

//reset password
export const resetPassword = async (payload: RenewPasswordPayload) => {
    const response = await API.post<AuthResponse>('/reset_password',payload );
    return response.data;
}

//refresh token
export const refreshToken = async () => {
    const response = await API.post<AuthResponse>('/refresh_token')
    return response.data;
}