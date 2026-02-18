export interface UpsertQnaRequest {
        category: string;
        title: string;
        isPrivate: boolean;
        detailCode: string;  // 수정용
        name: string;
        parentCode: string;
        content: string;
}