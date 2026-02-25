import type { OrderItemResponse } from "./orderItemResponse";

export interface OrderResponse {
    orderCode: string;
    orderItemList: OrderItemResponse[];
    itemsAmount: number
    createdAt: string
}
