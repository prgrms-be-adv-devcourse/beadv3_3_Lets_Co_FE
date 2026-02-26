import client from "./client";

const BASE_URL = '/assistant';

export const active = 
    async() => {
        const response = await client.post(`${BASE_URL}/start`);
        console.log(response.data);
    }

export const ask = 
    async(question: string) => {
        const response = await client.post(`${BASE_URL}/ask`, {
            question: question
        });
        console.log(response.data);

        return response.data;
    }