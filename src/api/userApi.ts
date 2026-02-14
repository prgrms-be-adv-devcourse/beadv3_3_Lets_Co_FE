import type { UpsertAddressRequest } from "../types/request/upsertAddressRequest";
import type { DeleteAddressRequest } from "../types/request/deleteAddressRequest";
import client from "./client";
import type { UpsertCardRequest } from "../types/request/upsertCardRequest";
import type { DeleteCardRequest } from "../types/request/deleteCardRequest";

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


export const getAddress =
async () => {
    const response = await client.post(`${BASE_URL}/address/list`);
    return response.data;
};

export const addAddress = 
    async (addData: UpsertAddressRequest) => {
        const response = await client.post(`${BASE_URL}/address/add`, addData);
        console.log(response.data);

        return response.data;
    }

export const updateAddress =
    async (updateData: UpsertAddressRequest) => {
        await client.put(`${BASE_URL}/address/update`, updateData)
    }

export const deleteAddress = 
    async (deleteData: DeleteAddressRequest) => {
        await client.delete(`${BASE_URL}/address/delete`, {
            data: deleteData
        });
    }

export const getCard =
async () => {
    const response = await client.post(`${BASE_URL}/card/list`);
    return response.data;
};

export const addCard = 
    async (addData: UpsertCardRequest) => {
        const response = await client.post(`${BASE_URL}/card/add`, addData);
        console.log(response.data);

        return response.data;
    }

export const updateCard =
    async (updateData: UpsertCardRequest) => {
        await client.put(`${BASE_URL}/card/update`, updateData)
    }

export const deleteCard = 
    async (deleteData: DeleteCardRequest) => {
        await client.delete(`${BASE_URL}/card/delete`, {
            data: deleteData
        });
    }
