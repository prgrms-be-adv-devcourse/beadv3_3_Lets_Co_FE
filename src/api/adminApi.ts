import type { LockedUntilRequest } from "../types/request/lockedUntilRequest";
import client from "./client";

const BASE_URL = '/admin/users';

export interface UserListParams {
    itemsPerPage: number;
    colum: 'DEFAULT' | 'ROLE' | 'ID' | 'MEMBERSHIP' | 'NAME';
    sorting: 'DEFAULT' | 'ASC' | 'DESC';
}

export const getUserList = async (
    page: number,  // 페이지 번호
    params: UserListParams  // 검색/정렬 조건 (Body)
) => {
    const result = await client.post(`${BASE_URL}/list/${page}`, params);
    console.log(result.data);

    return result.data;
};

export const getUserDetails = async (username: string) => {
    const result = await client.post(`${BASE_URL}/${username}`);
    console.log(result.data);

    return result.data;
}


export const blockUser = async (username: string, lockData: LockedUntilRequest) => {
    const result = await client.post(`${BASE_URL}/${username}/block`, lockData);
    console.log(result.data);

    return result.data;
}

export const deleteUser = async (username: string) => {
    const result = await client.delete(`${BASE_URL}/${username}`);
    console.log(result.data);

    return result.data;
}