import type { ProductOptionInfo } from "../productOptionInfo";

export interface ProductDetailResponse {
    productsCode: string;
    name: string;
    description: string;
    price: number;
    salePrice: number;
    viewCount: number;
    stock: number;
    status: string;
    options: ProductOptionInfo[];
}
