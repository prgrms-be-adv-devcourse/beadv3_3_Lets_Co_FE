import type { CategoryInfo } from "../categoryInfo";
import type { ImageInfo } from "../imageInfo";
import type { ProductOptionInfo } from "../productOptionInfo";

export interface SellerProductDetailsResponse {
    productsCode: string;
    name: string;
    description: string;
    price: number;
    salePrice: number;
    viewCount: number;
    stock: number;
    status: string;
    options: ProductOptionInfo[];
    category: CategoryInfo[];
    ip: CategoryInfo[];
    images: ImageInfo[];
}