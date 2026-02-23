import { useState, useEffect, type FormEvent, type JSX } from "react";
import { getCategory, addCategory } from "../../api/productApi";
import type { UpsertCategoryRequest } from "../../types/request/upsertCategoryRequest";
import type { CategorySortedResponse } from "../../types/response/CategorySortedResponse";

function AddCategory() {    
    const [categories, setCategories] = useState<CategorySortedResponse[]>([]);
    const [categoryName, setCategoryName] = useState<string>('');
    const [parentCode, setParentCode] = useState<string | null>(null);

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
        }
    };

    // 트리 구조의 카테고리를 select option으로 평탄화(Flatten)하는 재귀 함수
    const renderCategoryOptions = (cats: CategorySortedResponse[], depth: number = 0) => {
        let options: JSX.Element[] = [];
        
        cats.forEach(cat => {
            // 깊이에 따라 앞에 '—' 문자를 추가하여 시각적으로 하위 계층임을 표현
            const prefix = depth > 0 ? "—".repeat(depth) + " " : "";
            
            options.push(
                <option key={cat.categoryCode} value={cat.categoryCode}>
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
        <div>
            <h2>카테고리 추가</h2>
            
            <form onSubmit={handleSubmit}>
                {/* 상위 카테고리 선택 */}
                <div>
                    <label>상위 카테고리</label>
                    <select
                        value={parentCode || ""}
                        onChange={(e) => setParentCode(e.target.value || null)}
                    >
                        <option value="">[최상위 카테고리로 생성]</option>
                        {renderCategoryOptions(categories)}
                    </select>
                </div>

                {/* 추가할 카테고리 이름 입력 */}
                <div>
                    <label>새 카테고리 이름</label>
                    <input
                        type="text"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        placeholder="예: 아우터, 반팔티..."
                        required
                    />
                </div>

                <button 
                    type="submit"
                >
                    카테고리 추가하기
                </button>
            </form>
        </div>
    );
}

export default AddCategory;