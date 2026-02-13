export const GENDER_STATUS_LABELS: Record<string, string> = {
    MALE: '남성',
    FEMALE: '여성',
    OTHER: '그 외'
} as const;

export const GENDER_OPTIONS = Object.entries(GENDER_STATUS_LABELS).map(
    ([value, label]) => ({ value, label })
);