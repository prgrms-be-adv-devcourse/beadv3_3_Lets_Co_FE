import type { LockedUntilRequest } from "../types/request/lockedUntilRequest";
import type { UpsertInquiryAnswerRequest } from "../types/request/upsertInquiryAnswerRequest";
import type { UpsertNoticeRequest } from "../types/request/upsertNoticeRequest";
import client from "./client";

const BASE_URL = '/admin';

export interface UserListParams {
    itemsPerPage: number;
    colum: 'DEFAULT' | 'ROLE' | 'ID' | 'MEMBERSHIP' | 'NAME';
    sorting: 'DEFAULT' | 'ASC' | 'DESC';
}

export const getUserList = async (
    page: number,  // 페이지 번호
    params: UserListParams  // 검색/정렬 조건 (Body)
) => {
    const result = await client.post(`${BASE_URL}/users/list/${page}`, params);
    console.log(result.data);

    return result.data;
};

export const getUserDetails = async (username: string) => {
    const result = await client.post(`${BASE_URL}/users/${username}`);
    console.log(result.data);

    return result.data;
}


export const blockUser = async (username: string, lockData: LockedUntilRequest) => {
    const result = await client.post(`${BASE_URL}/users/${username}/block`, lockData);
    console.log(result.data);

    return result.data;
}

export const deleteUser = async (username: string) => {
    const result = await client.delete(`${BASE_URL}/users/${username}`);
    console.log(result.data);

    return result.data;
}


export const addNotice = 
    async(addData: UpsertNoticeRequest) =>  {
        const response = await client.post(`${BASE_URL}/notice`, addData);
        console.log(response.data);

        return response.data;
    }    

export const updateNotice = 
    async(noticeCode: string, updateData: UpsertNoticeRequest) =>  {
        const response = await client.put(`${BASE_URL}/notice/${noticeCode}`, updateData);
        console.log(response.data);

        return response.data;
    }    

export const deleteNotice = 
    async(noticeCode: string) =>  {
        const response = await client.delete(`${BASE_URL}/notice/${noticeCode}`);
        console.log(response.data);

        return response.data;
    }

export const answerInquiry = 
    async(inquiryCode: string, answerData: UpsertInquiryAnswerRequest) =>  {
        const response = await client.post(`${BASE_URL}/inquiry/${inquiryCode}`, answerData);
        console.log(response.data);

        return response.data;
    }    
