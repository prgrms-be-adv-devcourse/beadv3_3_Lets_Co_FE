import { useState } from "react";
import type { CategorySortedResponse } from "../types/response/categorySortedResponse";
interface Props {
    categories: CategorySortedResponse[];
    selectedCategory: string;
    onSelect: (code: string) => void;
}

// 개별 카테고리 노드 컴포넌트
function CategoryNode({
    category,
    selectedCategory,
    onSelect,
    level = 0,
}: {
    category: CategorySortedResponse;
    selectedCategory: string;
    onSelect: (code: string) => void;
    level?: number;
}) {
    const hasChildren = category.children && category.children.length > 0;
    
    // 기본적으로 최상위(level 0)는 열어두고, 나머지는 닫아둠
    const [isOpen, setIsOpen] = useState(level === 0);
    const isSelected = selectedCategory === category.categoryCode;

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleSelect = () => {
        onSelect(category.categoryCode);
    };

    return (
        <li className="mt-1">
            <div
                className={`group flex items-center gap-2 py-2.5 pr-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                    isSelected
                        ? "bg-blue-50 text-blue-700 font-bold border-blue-100 shadow-sm"
                        : "bg-transparent text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-transparent"
                }`}
                style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
                onClick={handleSelect}
            >
                {/* 토글 화살표 아이콘 */}
                {hasChildren ? (
                    <button
                        type="button" 
                        onClick={handleToggle}
                        className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-100/50 transition-colors focus:outline-none"
                    >
                        <svg
                            className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
                                isOpen ? "rotate-90" : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                ) : (
                    <div className="w-7" />
                )}

                {/* 카테고리 이름 */}
                <span className="flex-1 truncate select-none text-[15px]">
                    {category.categoryName}
                </span>

                {/* 선택 시 체크 표시 */}
                {isSelected && (
                    <svg
                        className="w-5 h-5 text-blue-600 flex-shrink-0 drop-shadow-sm"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </div>

            {/* 자식 카테고리 렌더링 */}
            {hasChildren && (
                <div 
                    className={`grid transition-all duration-300 ease-in-out ${
                        isOpen ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0"
                    }`}
                >
                    <ul className="overflow-hidden space-y-1">
                        {category.children.map((child) => (
                            <CategoryNode
                                key={child.categoryCode}
                                category={child}
                                selectedCategory={selectedCategory}
                                onSelect={onSelect}
                                level={level + 1}
                            />
                        ))}
                    </ul>
                </div>
            )}
        </li>
    );
}

// 메인 트리 컴포넌트
export default function CategoryTree({ categories, selectedCategory, onSelect }: Props) {
    if (!categories || categories.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center text-gray-500 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                <svg className="w-10 h-10 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="text-sm font-medium">등록된 카테고리가 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-sm max-h-[450px] overflow-y-auto
            [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent 
            [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full 
            hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 transition-colors"
        >
            <ul className="space-y-1">
                {categories.map((category) => (
                    <CategoryNode
                        key={category.categoryCode}
                        category={category}
                        selectedCategory={selectedCategory}
                        onSelect={onSelect}
                        level={0}
                    />
                ))}
            </ul>
        </div>
    );
}