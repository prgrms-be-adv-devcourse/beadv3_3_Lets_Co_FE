export interface PaymentHistoryRequest {
    paymentStatus: string[];
    paymentType: string[];
    startDate: string;
    endDate: string;
}