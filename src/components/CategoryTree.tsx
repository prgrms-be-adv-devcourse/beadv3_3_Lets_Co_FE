import type { CategorySortedResponse } from "../types/response/CategorySortedResponse";

interface Props {
    categories: CategorySortedResponse[];
    selectedCategory: string;
    onSelect: (code: string) => void;
    groupName?: string;
}

function CategoryTree({ categories, selectedCategory, onSelect, groupName = "category_selection" }: Props) {
    if (!categories || categories.length === 0) return null;

    return (
        <ul className="pl-5 border-l border-gray-100 ml-2 mt-1">
            {categories.map((category) => (
                <li key={category.categoryCode} className="mt-2 text-sm">
                    <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
                        <input
                            type="radio"
                            name={groupName} // 수정된 부분 (고정 문자열 대신 props 사용)
                            value={category.categoryCode}
                            checked={selectedCategory === category.categoryCode}
                            onChange={() => onSelect(category.categoryCode)}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <span>{category.categoryName}</span>
                    </label>
                    
                    {category.children && category.children.length > 0 && (
                        <CategoryTree
                            categories={category.children}
                            selectedCategory={selectedCategory}
                            onSelect={onSelect}
                            groupName={groupName}
                        />
                    )}
                </li>
            ))}
        </ul>
    );
}

export default CategoryTree;