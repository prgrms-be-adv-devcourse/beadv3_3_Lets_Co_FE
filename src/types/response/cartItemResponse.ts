import type { ItemInfo } from "../itemInfo"

export interface CartItemResponse {
    product: ItemInfo;
    quantity: number;
    amount: number;
}