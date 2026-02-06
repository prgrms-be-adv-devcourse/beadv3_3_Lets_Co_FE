export interface ProductInfo {
    productsIdx: number;
    productsCode: string;
    name: string;
    price: number;
    salePrice: number;
    viewCount: number;
}

export interface ProductResponse {
    resultCode: string;
    items: ProductInfo[];
}