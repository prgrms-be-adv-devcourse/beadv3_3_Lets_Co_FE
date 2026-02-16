import type { ProductDetailsResponse } from "../types/response/productDetailsResponse"; 
import type { ProductResponse } from "../types/response/productResponse";
import client from "./client";

const BASE_URL = "/products";

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

export const getProduct = async (productCode: string) => {
    const response = await client.get<ProductDetailsResponse> (`${BASE_URL}/${productCode}`);
    console.log(response.data);

    return response.data;
}
