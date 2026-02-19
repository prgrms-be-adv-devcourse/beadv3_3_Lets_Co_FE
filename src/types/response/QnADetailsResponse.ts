import type { ProductQuestionDetailsInfo } from "../productQuestionDetailsInfo";
import type { ProductQuestionInfo } from "../productQuestionInfo";

export interface QnADetailsResponse {

    questionDTO: ProductQuestionInfo;
    answerDTOs: ProductQuestionDetailsInfo[];
}