export interface ProductListResponse {
    productsCode: string;
    name: string;
    price: number;
    salePrice: number;
    viewCount: number;
    status: string;
    category: string[];
    imageUrl: string;
}
