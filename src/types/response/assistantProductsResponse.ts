import type { AssistantProductsResponse } from "./assistantResponse copy";

export interface AssistantResponse {
    answer: string;
    data: AssistantProductsResponse[];
}
