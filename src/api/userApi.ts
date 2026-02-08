import client from "./client";

const BASE_URL = '/users'

export const myPage = 
    async () => {
        const response = await client.post(`${BASE_URL}/my`);
        console.log(response.data);

        return response.data;
    };

export const profile =
    async () => {
        const resposne = await client.post(`${BASE_URL}/my/details`);
        console.log(resposne.data);

        return resposne.data;
    }
