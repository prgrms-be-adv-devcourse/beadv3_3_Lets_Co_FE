import type { WaitingQueueResponse } from "../types/response/waitingQueueResponse";
import client from "./client";

const BASE_URL = '/queue';

/*
* ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
* 입장 대기열 (Rate Limiter)
* 1초마다 N명씩 접근 가능
* ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
*/

// 입장 대기열 등록 (토큰 문자열 반환)
export const enterRegister = async (): Promise<string> => {
    const result = await client.post(`${BASE_URL}/enter/register`);
    return result.data;
}

// 입장 대기열 번호 조회
export const enterStatus = async (queueToken: string): Promise<WaitingQueueResponse> => {
    const result = await client.get(`${BASE_URL}/enter/status`, {
        headers: {
            'X-QUEUE-TOKEN': queueToken
        }
    });
    return result.data;
}


/*
* ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
* 주문 대기열 (Capacity Limiter)
* 빈자리가 나야지 입장
* ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
*/

// 주문 대기열 입장
export const orderEnter = async () => {
    const result = await client.post(`${BASE_URL}/orders/enter`);
    return result.data;
}

// 주문 대기열 번호 조회
export const orderStatus = async (): Promise<WaitingQueueResponse> => {
    const result = await client.get(`${BASE_URL}/orders/status`);
    return result.data;
}

// 주문 대기열 퇴장
export const orderExit = async () => {
    const result = await client.post(`${BASE_URL}/orders/success`);
    return result.data;
}