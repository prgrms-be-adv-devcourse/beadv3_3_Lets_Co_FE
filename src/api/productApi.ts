import type { UpsertProductRequest } from "../types/request/upsertProductRequest";
import type { ProductDetailResponse } from "../types/response/productDetailResponse";
import type { ProductResponse } from "../types/response/productResponse";
import client from "./client";

const BASE_URL = "/products";

export const addProduct = async (productData: UpsertProductRequest, images: File[]) => {
    const formData = new FormData();

    const json = JSON.stringify(productData);
    const blob = new Blob([json], { type: "application/json" });
    formData.append("request", blob);

    images.forEach((image) => {
        formData.append("images", image);
    });

    const response = await client.post(
        '/seller/products', 
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
    const response = await client.get<ProductDetailResponse> (`${BASE_URL}/${productCode}`);
    console.log(response.data);

    return response.data;
}
