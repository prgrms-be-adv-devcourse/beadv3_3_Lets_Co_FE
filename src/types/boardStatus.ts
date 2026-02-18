
export const BOARD_STATUS_LABELS: Record<string, string> = {
    DRAFT: '작성중',
    PUBLISHED: '게시됨',
    HIDDEN: '숨김',
    CLOSED: '종료',
    ANSWERED: '답변완료',
    WAITING: '답변대기'
} as const;

export const BOARD_STATUS_OPTIONS = Object.entries(BOARD_STATUS_LABELS).map(
    ([value, label]) => ({ value, label })
);
