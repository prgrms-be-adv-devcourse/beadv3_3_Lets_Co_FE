export interface RegisterRequest {
    ID: string;
    Mail: string;
    PW: string;
    PW_CHECK: string;
    name: string;
    gender: string;
    phoneNumber: string;
    birth: string;
    agreeTermsAt: string;
    agreePrivateAt: string;
    agreeMarketingAt: string | null;
}