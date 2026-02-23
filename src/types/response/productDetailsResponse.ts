import type { CategoryInfo } from "../categoryInfo";
import type { ImageInfo } from "../imageInfo";
import type { ProductOptionInfo } from "../productOptionInfo";

export interface ProductDetailsResponse {
    productsCode: string;
    name: string;
    description: string;
    price: number;
    salePrice: number;
    viewCount: number;
    stock: number;
    status: string;
    category: CategoryInfo[];
    ip: CategoryInfo[];
    images: ImageInfo[];
    options: ProductOptionInfo[];
}
