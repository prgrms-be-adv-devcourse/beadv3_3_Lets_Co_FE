import { useState, useEffect, type FormEvent, type JSX } from "react";
import { getCategory, addCategory } from "../../api/productApi";
import type { UpsertCategoryRequest } from "../../types/request/upsertCategoryRequest";
import type { CategorySortedResponse } from "../../types/response/categorySortedResponse";

function AddCategory() {    
    const [categories, setCategories] = useState<CategorySortedResponse[]>([]);
    const [categoryName, setCategoryName] = useState<string>('');
    const [parentCode, setParentCode] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await getCategory();
            setCategories(data);
        } catch (error) {
            console.error("카테고리 목록 불러오기 실패:", error);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!categoryName.trim()) {
            alert("카테고리 이름을 입력해주세요.");
            return;
        }

        setIsSubmitting(true);

        const requestData: UpsertCategoryRequest = {
            categoryName: categoryName,
            parentCode: parentCode === "" ? null : parentCode,
        };

        try {
            await addCategory(requestData);
            alert("카테고리가 성공적으로 추가되었습니다.");
            
            setCategoryName('');
            setParentCode(null);
            fetchCategories(); 
            
        } catch (error) {
            console.error("카테고리 추가 실패:", error);
            alert("카테고리 추가에 실패했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // 트리 구조의 카테고리를 select option으로 평탄화(Flatten)하는 재귀 함수
    const renderCategoryOptions = (cats: CategorySortedResponse[], depth: number = 0) => {
        let options: JSX.Element[] = [];
        
        cats.forEach(cat => {
            // '└' 기호를 사용하여 시각적으로 하위 계층임을 명확히 표현
            const indent = "\u00A0\u00A0\u00A0".repeat(depth);
            const prefix = depth > 0 ? `${indent}└ ` : "";
            
            options.push(
                <option key={cat.categoryCode} value={cat.categoryCode} className="py-1">
                    {prefix}{cat.categoryName}
                </option>
            );
            
            // 자식 카테고리가 있다면 재귀 호출하여 바로 아래에 붙임
            if (cat.children && cat.children.length > 0) {
                options = options.concat(renderCategoryOptions(cat.children, depth + 1));
            }
        });
        
        return options;
    };

    return (
        <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-10">
                
                {/* 헤더 영역 */}
                <div className="mb-8 border-b border-gray-100 pb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <span className="w-1.5 h-7 bg-blue-600 rounded-full inline-block"></span>
                        카테고리 추가
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 ml-3">
                        새로운 상품 카테고리를 생성하고 상위/하위 구조를 설정하세요.
                    </p>
                </div>

                {/* 폼 영역 */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* 상위 카테고리 선택 */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            상위 카테고리 위치
                        </label>
                        <select
                            value={parentCode || ""}
                            onChange={(e) => setParentCode(e.target.value || null)}
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-base rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-3.5 transition-colors outline-none cursor-pointer appearance-none hover:bg-gray-100"
                        >
                            <option value="" className="font-bold text-blue-600">
                                [최상위 카테고리로 생성]
                            </option>
                            {renderCategoryOptions(categories)}
                        </select>
                        <p className="mt-2 text-xs text-gray-400">
                            * 선택하지 않으면 가장 상위 레벨의 카테고리로 생성됩니다.
                        </p>
                    </div>

                    {/* 추가할 카테고리 이름 입력 */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            새 카테고리 이름 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            placeholder="예: 남성 의류, 아우터, 반팔티..."
                            required
                            className="w-full bg-white border border-gray-300 text-gray-900 text-base rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-3.5 transition-all outline-none"
                        />
                    </div>

                    {/* 액션 버튼 */}
                    <div className="pt-4">
                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 text-white font-bold text-lg py-4 rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "처리 중..." : "카테고리 추가하기"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default AddCategory;