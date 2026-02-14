import type { ProductRequest } from "./productRequest";

export interface OrderRequest {
    orderType: string;
    productInfo: ProductRequest | null;
}
