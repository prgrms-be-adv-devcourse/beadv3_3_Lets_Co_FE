import type { ProductInfo } from "../productInfo";

export interface ProductResponse {
    resultCode: string;
    items: ProductInfo[];
}