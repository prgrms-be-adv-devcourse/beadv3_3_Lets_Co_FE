export interface RegisterRequest {
    agreeTermsAt: string;
    agreePrivateAt: string;
    agreeMarketingAt: string | null;
    name: string;
    phoneNumber: string;
    birth: string;
    ID: string;
    PW: string;
}