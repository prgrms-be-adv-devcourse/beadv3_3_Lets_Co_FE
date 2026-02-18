
export interface NoticeResponse {
    Code: string;
    Category: string;
    title: string;
    status: string;
    publishedAt: string;
    viewCount: number;
    isPrivate: boolean;
    isPined: boolean;
    updatedAt: string;
}


// CustomerServiceStatus
    // DRAFT,      // 작성중
    // PUBLISHED,  // 게시됨
    // HIDDEN,     //숨김
    // CLOSED,     //종료
    // ANSWERED,   //답변완료
    // WAITING      //답변대기
