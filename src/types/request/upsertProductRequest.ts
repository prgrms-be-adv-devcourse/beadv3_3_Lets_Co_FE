import type { ProductOptionInfo } from "../productOptionInfo";

export interface UpsertProductRequest {
        name: string;
        description: string;
	    price: number;
		salePrice: number;
		stock: number;
		status: string;
        options: ProductOptionInfo[]
		categoryCode: string;
		ipCode: string;
}