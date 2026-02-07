import type { AddProductRequest } from "../types/request/addProductRequest";
import type { ProductDetailResponse } from "../types/response/productDetailResponse";
import type { ProductResponse } from "../types/response/productResponse";
import client from "./client";

const BASE_URL = "/products";

export const addProduct =
    async (productData: AddProductRequest) => {
        const response = await client.post('/seller/products', productData);
        console.log(response.data);

        return response.data;
};

export const getProducts = async (search: string, page: number = 0, size: number = 5) => {
    const response = await client.get<ProductResponse>(BASE_URL, {
        params: {
            search: search,
            page: page,
            size: size,
            sort: "productsCode,desc"
        }
    });
    console.log(response.data);

    return response.data;
};

export const getProduct = async (optionCode: string) => {
    const response = await client.get<ProductDetailResponse> (`${BASE_URL}/${optionCode}`);
    console.log(response.data);

    return response.data;
}

