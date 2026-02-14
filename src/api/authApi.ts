import type { RegisterRequest } from "../types/request/registerRequest";
import type { AuthenticationRequest } from "../types/request/authenticationRequest";
import type { LoginRequest } from "../types/request/loginRequest";
import client from "./client";
import type { OAuth2RegisterRequest } from "../types/request/oauth2RegisterRequest";

const BASE_URL = '/auth';

export const register = 
    async (registerData: RegisterRequest) => {
        const response = await client.post(`${BASE_URL}/signup`, registerData);
        console.log(response.data);

        return response.data;
    };

export const oAuth2Register = 
async (registerData: OAuth2RegisterRequest) => {
    const response = await client.post(`${BASE_URL}/oauth2/signup`, registerData);
    console.log(response.data);

    return response.data;
};

export const checkCode =
    async (authCode: AuthenticationRequest) => {
        const response = await client.post(`${BASE_URL}/signup/Authentication`, authCode);
        console.log(response.data);

        return response.data;
    };

export const login = 
    async (loginData: LoginRequest) => {
        const response = await client.post(`${BASE_URL}/login`, loginData);
        console.log(response.data);

        return response.data;
    };

export const logout = 
    async () => {
        return await client.post(`${BASE_URL}/logout`);
    };
