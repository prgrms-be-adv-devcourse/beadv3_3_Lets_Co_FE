export interface OAuth2RegisterRequest {
    name: string;
    gender: string;
    phoneNumber: string;
    birth: string;
    agreeTermsAt: string;
    agreePrivateAt: string;
    agreeMarketingAt: string | null;
}