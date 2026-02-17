
export interface UpsertNoticeRequest {
    category: string;
    status: string;
    title: string;
    content: string;
    isPrivate: boolean;
    isPinned: boolean;
    publishedAt: string;
}
