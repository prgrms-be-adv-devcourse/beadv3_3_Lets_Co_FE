import type { ItemInfo } from "../itemInfo";

export interface OrderItemResponse {
    product: ItemInfo;
    quantity: number;
    amount: number;
}
