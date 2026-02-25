import type { UpsertCategoryRequest } from "../types/request/upsertCategoryRequest";
import client from "./client";

const BASE_URL = "/products";

export const getProducts = async (search: string, page: number = 0, size: number = 5) => {
    const response = await client.get(BASE_URL, {
        params: {
            search: search,
            page: page,
            size: size
        }
    });
    console.log(response.data);

    return response.data;
};

export const getProduct = async (productsCode: string) => {
    const response = await client.get(`${BASE_URL}/${productsCode}`);
    console.log(response.data);

    return response.data;
}

export const getCategory = async () => {
    const response = await client.get(`${BASE_URL}/category`);
    console.log(response.data);

    return response.data;
}

export const getIP = async () => {
    const response = await client.get(`${BASE_URL}/ip`);
    console.log(response.data);

    return response.data;
}

export const addCategory = async (addData: UpsertCategoryRequest) => {
    const response = await client.post(`${BASE_URL}/admin/category`, addData);
    console.log(response.data);

    return response.data;
}

export const addIP = async (addData: UpsertCategoryRequest) => {
    const response = await client.post(`${BASE_URL}/ip`, addData);
    console.log(response.data);

    return response.data;
}

