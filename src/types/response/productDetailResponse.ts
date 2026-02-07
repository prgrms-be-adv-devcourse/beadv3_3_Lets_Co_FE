export interface productOptionInfo {
    optionGroupIdx: number;
    code: string
    name: string
    sortOrder: number
    price: number
    salePrice: number
    stock: number
    status: string
}

export interface ProductDetailResponse {
    productsCode: string;
    name: string;
    description: string;
    price: number;
    salePrice: number;
    viewCount: number;
    stock: number;
    status: string;
    options: productOptionInfo[];
}
