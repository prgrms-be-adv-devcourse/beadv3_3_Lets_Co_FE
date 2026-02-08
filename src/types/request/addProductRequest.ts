import type { ProductOptionInfo } from "../productOptionInfo";

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