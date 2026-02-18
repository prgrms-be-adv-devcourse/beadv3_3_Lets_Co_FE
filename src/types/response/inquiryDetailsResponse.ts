import type { InquiryDetailsInfo } from "../inquiryDetailsInfo";
import type { InquiryInfo } from "../inquiryInfo";

export interface InquiryDetailsResponse {
    isOwner: boolean;
    info: InquiryInfo;
    details: InquiryDetailsInfo[];
}