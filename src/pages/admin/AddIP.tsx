import { useState, useEffect, type FormEvent, type JSX } from "react";
import { getIP, addIP } from "../../api/productApi";
import type { UpsertCategoryRequest } from "../../types/request/upsertCategoryRequest";
import type { CategorySortedResponse } from "../../types/response/categorySortedResponse";

function AddIP() {    
    const [ips, setIPs] = useState<CategorySortedResponse[]>([]);
    const [ipName, setIPName] = useState<string>('');
    const [parentCode, setParentCode] = useState<string>('0');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
            alert("아이피 이름을 입력해주세요.");
            return;
        }

        setIsSubmitting(true);

        const requestData: UpsertCategoryRequest = {
            categoryName: ipName,
            parentCode: parentCode
        };

        try {
            await addIP(requestData);
            alert("아이피가 성공적으로 추가되었습니다.");
            
            setIPName('');
            setParentCode('0');
            fetchIP(); 
            
        } catch (error) {
            console.error("아이피 추가 실패:", error);
            alert("아이피 추가에 실패했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // 트리 구조의 아이피를 select option으로 평탄화(Flatten)하는 재귀 함수
    const renderCIPOptions = (cats: CategorySortedResponse[], depth: number = 0) => {
        let options: JSX.Element[] = [];
        
        cats.forEach(ip => {
            // '└' 기호를 사용하여 시각적으로 하위 계층임을 명확히 표현
            const indent = "\u00A0\u00A0\u00A0".repeat(depth);
            const prefix = depth > 0 ? `${indent}└ ` : "";
            
            options.push(
                <option key={ip.categoryCode} value={ip.categoryCode} className="py-1">
                    {prefix}{ip.categoryName}
                </option>
            );
            
            // 자식 아이피가 있다면 재귀 호출하여 바로 아래에 붙임
            if (ip.children && ip.children.length > 0) {
                options = options.concat(renderCIPOptions(ip.children, depth + 1));
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
                        <span className="w-1.5 h-7 bg-purple-600 rounded-full inline-block"></span>
                        아이피(IP) 추가
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 ml-3">
                        새로운 상품 아이피(브랜드/캐릭터 등)를 생성하고 계층 구조를 설정하세요.
                    </p>
                </div>

                {/* 폼 영역 */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* 상위 아이피 선택 */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            상위 아이피 위치
                        </label>
                        <select
                            value={parentCode}
                            onChange={(e) => setParentCode(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-base rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 block p-3.5 transition-colors outline-none cursor-pointer appearance-none hover:bg-gray-100"
                        >
                        <option 
                            value="0"
                            className="font-bold text-purple-600"
                            >
                                [최상위 아이피로 생성]
                        </option>
                            {renderCIPOptions(ips)}
                        </select>
                        <p className="mt-2 text-xs text-gray-400">
                            * 선택하지 않으면 가장 상위 레벨의 아이피로 생성됩니다.
                        </p>
                    </div>

                    {/* 추가할 아이피 이름 입력 */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            새 아이피 이름 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={ipName}
                            onChange={(e) => setIPName(e.target.value)}
                            placeholder="예: 디즈니, 마블, 산리오..."
                            required
                            className="w-full bg-white border border-gray-300 text-gray-900 text-base rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 block p-3.5 transition-all outline-none"
                        />
                    </div>

                    {/* 액션 버튼 */}
                    <div className="pt-4">
                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-purple-600 text-white font-bold text-lg py-4 rounded-xl shadow-md hover:bg-purple-700 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "처리 중..." : "아이피 추가하기"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default AddIP;