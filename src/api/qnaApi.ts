import type { UpsertQnaRequest } from "../types/response/upsertQnaRequest";
import client from "./client";

const BASE_URL = '/qna';

export const getQnAList = async (productCode: string, page: number, size: number) => {
    const result = await client.get(`${BASE_URL}/products/${productCode}`, {
        params: {
            page: page,
            size: size
        }
    });
    console.log(result.data);
    
    return result.data;
}

export const getQnADetails = async (qnaCode: string) => {
    const result = await client.get(`${BASE_URL}/${qnaCode}`);
    console.log(result.data);
    
    return result.data;
}

export const addQnA = async (productCode: string, addData: UpsertQnaRequest) => {
    const result = await client.post(`${BASE_URL}/products/${productCode}`, addData);

    return result.data;
}

export const updateQnA = async (qnaCode: string, updateData: UpsertQnaRequest) => { 
    const result = await client.put(`${BASE_URL}/${qnaCode}`, updateData);
    
    return result.data;
}

export const deleteQnA = async (qnaCode: string) => { 
    const result = await client.put(`${BASE_URL}/${qnaCode}`);
    
    return result.data;
}
