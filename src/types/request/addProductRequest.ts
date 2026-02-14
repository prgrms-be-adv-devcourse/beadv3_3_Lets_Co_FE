import type { ProductOptionInfo } from "../productOptionInfo";
import type { ProductImageInfo } from "../productImageInfo";

export interface AddProductRequest {
        name: string;
        description: string;
	    price: number;
		salePrice: number;
		stock: number;
		status: string;
        options: ProductOptionInfo[]
		images: ProductImageInfo[] | null;
}