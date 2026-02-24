import client from "./client";
import type { ProductRequest } from "../types/request/productRequest"; 

const BASE_URL = "/carts";

export const addCart = 
    async(productData: ProductRequest) => {
        const result = await client.post(`${BASE_URL}/add`, productData);
        console.log(result.data);
        
        return result.data;
    }


export const getCartList =
    async() => {
        const result = await client.get(BASE_URL);
        console.log(result.data);

        return result.data;
    }

export const plusCart = 
    async(optionCode: string) => {
        const result = await client.post(`${BASE_URL}/plus/${optionCode}`);
        console.log(result.data);
        
        return result.data;
    }

export const minusCart = 
async(optionCode: string) => {
    const result = await client.post(`${BASE_URL}/minus/${optionCode}`);
    console.log(result.data);
    
    return result.data;
}


export const deleteCart = 
async(optionCode: string) => {
    const result = await client.delete(`${BASE_URL}/${optionCode}`);
    console.log(result.data);
    
    return result.data;
}


