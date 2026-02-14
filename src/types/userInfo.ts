import type { AddressInfo } from "./addressInfo";
import type { CardInfo } from "./cardInfo";

export interface UserInfo {
    addressInfo: AddressInfo;
    cardInfo: CardInfo | null;
}
