import client from "./client";
import type { ChargeRequest } from "../types/request/chargeRequest";
import type { PaymentRequest } from "../types/request/paymentRequest";

const BASE_URL = "/payments";

export const charge = 
    async(chargeData: ChargeRequest) => {
        const result = await client.post(`${BASE_URL}/charge`, chargeData);
        console.log(result.data);
        
        return result.data;
    }

export const payment = 
    async(paymentData: PaymentRequest) => {
        const result = await client.post(`${BASE_URL}/process`, paymentData);
        console.log(result.data);
    
    return result.data;
}
