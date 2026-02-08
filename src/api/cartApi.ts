import client from "./client";
import type { ProductRequest } from "../types/request/productRequest"; 

const BASE_URL = "/carts";

export const addCart = 
    async(productData: ProductRequest) => {
        const result = await client.post(`${BASE_URL}/add`, productData);
        console.log(result.data);
        
        return result.data;
    }


export const getCarts =
    async() => {
        const result = await client.get(BASE_URL);
        console.log(result.data);

        return result.data;
    }