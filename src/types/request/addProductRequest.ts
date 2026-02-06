import type { ProductOptionInfo } from "../ProductOptionInfo";

export interface AddProductRequest {
        name: string;
        description: string;
	    price: number;
		salePrice: number;
		stock: number;
		status: string;
        options: ProductOptionInfo[];
		images: any[];
}