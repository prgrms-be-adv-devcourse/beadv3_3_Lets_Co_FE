import type { ProductRequest } from "./productRequest";
import type { AddressInfo } from "../addressInfo";
import type { CardInfo } from "../cardInfo";

export interface OrderRequest {
    orderType: string;
    productInfo: ProductRequest;
    addressInfo: AddressInfo;
    cardInfo: CardInfo;
    paymentType: string;
    tossKey: string;
}
