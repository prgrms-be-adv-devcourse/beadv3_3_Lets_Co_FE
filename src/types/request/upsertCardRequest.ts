export interface UpsertCardRequest {
    cardCode: string;
    defaultCard: boolean;
    cardBrand: string;
    cardName: string;
    cardToken: string;
    expMonth: number;
    expYear: number;
}