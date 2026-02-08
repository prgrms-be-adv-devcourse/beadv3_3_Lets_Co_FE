import type { OrderRequest } from "../types/request/OrderRequest"; 
import client from "./client";

const BASE_URL = "/orders";

export const order = 
    async(orderDirectRequest: OrderRequest) => {
        const response = await client.post(BASE_URL, orderDirectRequest);
        console.log(response.data);

        return response.data;
    }

export const getOrders =
    async() => {
        const response = await client.get(BASE_URL);
        console.log(response.data);

        return response.data;
    }

export const getOrder =
    async(orderCode: string) => {
        const response = await client.get(`${BASE_URL}/${orderCode}`);
        console.log(response.data);

        return response.data;
    }