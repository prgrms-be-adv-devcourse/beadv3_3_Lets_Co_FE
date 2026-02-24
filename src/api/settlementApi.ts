import client from "./client";

const BASE_URL = '/settlement';

export const manualSettlement = 
    async() =>  {
        const response = await client.post(`${BASE_URL}/manual`)
        console.log(response.data);

        return response.data;
    }
