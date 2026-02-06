import type { AuthenticationRequest } from "../types/request/authenticationRequest";
import type { SellerRegisterRequest } from "../types/request/sellerRegisterRequest";
import client from "./client"

const BASE_URL = '/seller/users'

export const sellerRegister =
    async (sellerData: SellerRegisterRequest) => {
        const response = await client.post(`${BASE_URL}/register`, sellerData);
        console.log(response);
        return response.data;
    } 

export const checkCode =
    async (authCode: AuthenticationRequest) => {
        const response = await client.post(`${BASE_URL}/register/check`, authCode);
        console.log(response.data);

        return response.data;
    };

