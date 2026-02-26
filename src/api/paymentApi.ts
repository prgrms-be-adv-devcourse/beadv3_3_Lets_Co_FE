import client from "./client";
import { orderExit } from "./queue";
import type { ChargeRequest } from "../types/request/chargeRequest";
import type { PaymentRequest } from "../types/request/paymentRequest";

const BASE_URL = "/payments";

export const payment = async (paymentData: PaymentRequest) => {
    try {
        const result = await client.post(`${BASE_URL}/process`, paymentData);
        console.log(result.data);
        return result.data;
    } finally {
        // 결제가 성공하든 실패하든(try/catch) 무조건 실행되어 대기열에서 퇴장
        try {
            await orderExit();
            console.log("주문 대기열 퇴장 완료");
        } catch (error) {
            console.error("대기열 퇴장 실패:", error);
        }
    }
};

export const charge = async (chargeData: ChargeRequest) => {
    try {
        const result = await client.post(`${BASE_URL}/charge`, chargeData);
        console.log(result.data);
        return result.data;
    } finally {
        // 예치금 결제 시에도 완료 후 무조건 대기열 퇴장
        try {
            await orderExit();
            console.log("예치금/결제 대기열 퇴장 완료");
        } catch (error) {
            console.error("대기열 퇴장 실패:", error);
        }
    }
};

export const refund = async (orderCode: string) => {
    const result = await client.post(`${BASE_URL}/refund/${orderCode}`);
    console.log(result.data);
    return result.data;
};