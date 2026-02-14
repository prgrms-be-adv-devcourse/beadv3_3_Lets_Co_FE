import type { UserInfo } from "../userInfo";

export interface PaymentRequest {
    orderCode: string;
    userInfo: UserInfo;
    paymentType: string;
    amount: number;
    tossKey: string | null;
}