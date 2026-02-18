import client from "./client";

const BASE_URL = '/notice';

export const getNoticeList = 
    async(page: number, size: number) =>  {
        const response = await client.get(BASE_URL, {
            params: {
                page: page,
                size: size
            }
        });
        console.log(response.data);

        return response.data;
    }

export const getNoticeDetails = 
    async(noticeCode: string) =>  {
        const response = await client.get(`${BASE_URL}/${noticeCode}`);
        console.log(response.data);

        return response.data;
    }    