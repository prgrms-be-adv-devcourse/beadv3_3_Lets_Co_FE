import type { UpsertInquiryRequest } from "../types/request/upsertInquiryRequest";
import client from "./client";

const BASE_URL = '/inquiry';

export const addInquiry = 
    async(addData: UpsertInquiryRequest) =>  {
        const response = await client.post(BASE_URL, addData);
        console.log(response.data);

        return response.data;
    }    

export const getInquiryList = 
    async(page: number, size: number) =>  {
        const response = await client.get(BASE_URL, {
            params: {
                page: page,
                size: size
            }
        });
        console.log(response.data);

        return response.data;
    }

export const getInquiryDetails = 
    async(inquiryCode: string) =>  {
        const response = await client.get(`${BASE_URL}/${inquiryCode}`);
        console.log(response.data);

        return response.data;
    }    

export const updateInquiry = 
    async(inquiryCode: string, updateData: UpsertInquiryRequest) =>  {
        const response = await client.put(`${BASE_URL}/${inquiryCode}`, updateData);
        console.log(response.data);

        return response.data;
    }    

export const deleteInquiry = 
    async(inquiryCode: string) =>  {
        const response = await client.delete(`${BASE_URL}/${inquiryCode}`);
        console.log(response.data);

        return response.data;
    }    
