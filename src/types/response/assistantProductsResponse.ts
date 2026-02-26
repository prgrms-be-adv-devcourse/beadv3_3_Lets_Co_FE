import type { AssistantProductsResponse } from "./assistantResponse";

export interface AssistantResponse {
    answer: string;
    data: AssistantProductsResponse[];
}
