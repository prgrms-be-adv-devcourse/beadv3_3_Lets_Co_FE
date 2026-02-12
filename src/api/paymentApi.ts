import client from "./client";
import type { ChargeRequest } from "../types/request/chargeRequest";

const BASE_URL = "/payments";

export const charge = 
    async(chargeData: ChargeRequest) => {
        const result = await client.post(`${BASE_URL}/charge`, chargeData);
        console.log(result.data);
        
        return result.data;
    }
