export const PRODUCT_STATUS_LABELS: Record<string, string> = {
    ON_SALE: '판매 중',
    SOLD_OUT: '품절',
    STOPPED: '숨김 (판매자)',
    BLOCKED: '차단됨',
    STOP_SELLING: '판매 종료',
    HIDE: '숨김 (관리자)',
} as const;

export const PRODUCT_STATUS_OPTIONS = Object.entries(PRODUCT_STATUS_LABELS).map(
    ([value, label]) => ({ value, label })
);