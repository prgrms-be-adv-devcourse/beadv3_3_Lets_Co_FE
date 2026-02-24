import type { AuthenticationRequest } from "../types/request/authenticationRequest";
import type { SellerRegisterRequest } from "../types/request/sellerRegisterRequest";
import type { UpsertProductRequest } from "../types/request/upsertProductRequest";
import type { UpsertSellerQnARequest } from "../types/request/upsertSellerQnARequest";
import client from "./client"

const BASE_URL = '/seller'

export const sellerRegister =
    async (sellerData: SellerRegisterRequest) => {
        const response = await client.post(`${BASE_URL}/users/register`, sellerData);
        console.log(response);
        return response.data;
    } 

export const checkCode =
    async (authCode: AuthenticationRequest) => {
        const response = await client.post(`${BASE_URL}/users/register/check`, authCode);
        console.log(response.data);

        return response.data;
    };


export const addProduct = 
    async (productData: UpsertProductRequest, images: File[]) => {
        const formData = new FormData();

        const json = JSON.stringify(productData);
        const blob = new Blob([json], { type: "application/json" });
        formData.append("request", blob);

        images.forEach((image) => {
            formData.append("images", image);
        });

        const response = await client.post(
            `${BASE_URL}/products`, 
            formData, 
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
    console.log(response.data);

        return response.data;
    };


export const getSellerProductList = async (
    page: number, 
    size: number, 
    search?: string, 
    category?: string, 
    ip?: string
) => {
    const response = await client.get(`${BASE_URL}/products`, {
        params: {
            page: page,
            size: size,
            search: search || undefined,
            category: category || undefined,
            ip: ip || undefined
        }
    });
    return response.data;
};

export const getSellerProductDetails = async (code: string) => {
    const response = await client.get(`${BASE_URL}/products/${code}`);
    return response.data;
};

export const updateSellerProduct = async (code: string, productData: UpsertProductRequest, images: File[]) => {
    const formData = new FormData();

    const json = JSON.stringify(productData);
    const blob = new Blob([json], { type: "application/json" });
    formData.append("request", blob);

    images.forEach((image) => {
        formData.append("images", image);
    });

    const response = await client.put(`${BASE_URL}/products/${code}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const deleteSellerProduct = async(code: string) => {
    const response = await client.delete(`${BASE_URL}/products/${code}`);
    return response.data;
};


export const getSellerQnAList = async(page: number, size: number) => {
    const response = await client.get(`${BASE_URL}/qna`, {
            params: {
                page: page,
                size: size,
            }
    });
    console.log(response.data);

    return response.data;
}

export const addSellerQnA = async(pqnaCode: string, addData: UpsertSellerQnARequest) => {
    const response = await client.post(`${BASE_URL}/qna/${pqnaCode}`, addData)
    console.log(response.data);

    return response.data;
}