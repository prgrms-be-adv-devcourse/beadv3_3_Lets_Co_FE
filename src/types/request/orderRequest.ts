import type { AddressInfo } from "../addressInfo";
import type { CardInfo } from "../cardInfo";

interface ProductRequestData {
    productCode: string;
    optionCode: string;
    quantity: number;
}

export interface OrderRequest {
    orderType: string;
    productInfo: ProductRequestData;
    addressInfo: AddressInfo;
    cardInfo: CardInfo;
    paymentType: string;
    tossKey: string;
}
