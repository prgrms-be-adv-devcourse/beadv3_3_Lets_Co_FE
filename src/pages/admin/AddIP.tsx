import { useState, useEffect, type FormEvent, type JSX } from "react";
import { getIP, addIP } from "../../api/productApi";
import type { UpsertCategoryRequest } from "../../types/request/upsertCategoryRequest";
import type { CategorySortedResponse } from "../../types/response/CategorySortedResponse";

function AddIP() {    
    const [ips, setIPs] = useState<CategorySortedResponse[]>([]);
    const [ipName, setIPName] = useState<string>('');
    const [parentCode, setParentCode] = useState<string | null>(null);

    useEffect(() => {
        fetchIP();
    }, []);

    const fetchIP = async () => {
        try {
            const data = await getIP();
            setIPs(data);
        } catch (error) {
            console.error("아이피 목록 불러오기 실패:", error);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!ipName.trim()) {
            alert("카테고리 이름을 입력해주세요.");
            return;
        }

        const requestData: UpsertCategoryRequest = {
            categoryName: ipName,
            parentCode: parentCode === "" ? null : parentCode,
        };

        try {
            await addIP(requestData);
            alert("카테고리가 성공적으로 추가되었습니다.");
            
            setIPName('');
            setParentCode(null);
            fetchIP(); 
            
        } catch (error) {
            console.error("카테고리 추가 실패:", error);
            alert("카테고리 추가에 실패했습니다.");
        }
    };

    // 트리 구조의 카테고리를 select option으로 평탄화(Flatten)하는 재귀 함수
    const renderCIPOptions = (cats: CategorySortedResponse[], depth: number = 0) => {
        let options: JSX.Element[] = [];
        
        cats.forEach(ip => {
            // 깊이에 따라 앞에 '—' 문자를 추가하여 시각적으로 하위 계층임을 표현
            const prefix = depth > 0 ? "—".repeat(depth) + " " : "";
            
            options.push(
                <option key={ip.categoryCode} value={ip.categoryCode}>
                    {prefix}{ip.categoryName}
                </option>
            );
            
            // 자식 카테고리가 있다면 재귀 호출하여 바로 아래에 붙임
            if (ip.children && ip.children.length > 0) {
                options = options.concat(renderCIPOptions(ip.children, depth + 1));
            }
        });
        
        return options;
    };

    return (
        <div>
            <h2>아이피 추가</h2>
            
            <form onSubmit={handleSubmit}>
                {/* 상위 카테고리 선택 */}
                <div>
                    <label>상위 아이피</label>
                    <select
                        value={parentCode || ""}
                        onChange={(e) => setParentCode(e.target.value || null)}
                    >
                        <option value="">[최상위 아이피로 생성]</option>
                        {renderCIPOptions(ips)}
                    </select>
                </div>

                {/* 추가할 카테고리 이름 입력 */}
                <div>
                    <label>새 카테고리 이름</label>
                    <input
                        type="text"
                        value={ipName}
                        onChange={(e) => setIPName(e.target.value)}
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

export default AddIP;