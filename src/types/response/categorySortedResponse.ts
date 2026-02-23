
export interface CategorySortedResponse {
    categoryCode: string;
    categoryName: string;
    level: number;
    children: CategorySortedResponse[];
}
