import type { ProductQuestionDetailsInfo } from "../ProductQuestionDetailsInfo";
import type { ProductQuestionInfo } from "../productQuestionInfo";

export interface QnADetailsResponse {

    questionDTO: ProductQuestionInfo;
    answerDTOs: ProductQuestionDetailsInfo[];
}