import type { OrderRequest } from "../types/request/orderRequest";
import client from "./client";

const BASE_URL = "/orders";

export const order = 
    async(orderData: OrderRequest) => {
        const response = await client.post(BASE_URL, orderData);
        console.log(response.data);

        return response.data;
    }

export const getOrderList = 
    async (page: number, size: number) => {
        const response = await client.get(BASE_URL, {
            params: {
                page: page,
                size: size
            }
        });

        return response.data.data.content; 
    }

export const getOrderDetails =
    async(orderCode: string) => {
        const response = await client.get(`${BASE_URL}/${orderCode}`);
        console.log(response.data);

    
        return response.data.data;
    }