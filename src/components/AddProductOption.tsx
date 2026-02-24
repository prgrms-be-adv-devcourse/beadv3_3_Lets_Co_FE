import type { Dispatch, SetStateAction } from "react";
import type { ProductOptionInfo } from "../types/productOptionInfo";
import { PRODUCT_STATUS_OPTIONS } from "../types/productStatus";

interface Props {
    options: ProductOptionInfo[];
    setOptions: Dispatch<SetStateAction<ProductOptionInfo[]>>;
}

function AddProductOption({options, setOptions}: Props) {

    const handleOptionChange = (index: number, field: keyof ProductOptionInfo, value: any) => {
        const newOptions = [...options];
        (newOptions[index] as any)[field] = value; 
        setOptions(newOptions);
    };

    const addOption = () => {
        const newOption: ProductOptionInfo = {
            code: '',
            name: '',
            sortOrder: options.length + 1,
            price: 0,
            salePrice: 0,
            stock: 0,
            status: 'ON_SALE'
        };
        setOptions([...options, newOption]);
    };

    const removeOption = (index: number) => {
        if (options.length <= 1) {
            alert("옵션은 최소 1개가 필수입니다.");
            return;
        }

        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
    };

    return (
        <div className="space-y-4">
            {/* 상단 타이틀 및 추가 버튼 영역 */}
            <div className="flex justify-between items-center pb-2">
                <h3 className="text-md font-bold text-gray-800">
                    옵션 목록 <span className="text-blue-600">({options.length})</span>
                </h3>
                <button 
                    type="button" 
                    onClick={addOption}
                    className="text-sm bg-blue-50 text-blue-600 font-semibold px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    옵션 추가
                </button>
            </div>

            {/* 옵션 카드 목록 */}
            <div className="space-y-4">
                {options.map((opt, index) => (
                    <div key={index} className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm relative group">
                        
                        {/* 옵션 카드 헤더 & 삭제 버튼 */}
                        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
                            <span className="font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-md text-sm">
                                옵션 #{index + 1}
                            </span>
                            <button 
                                type="button" 
                                onClick={() => removeOption(index)}
                                className="text-sm text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors font-medium flex items-center gap-1"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                삭제
                            </button>
                        </div>

                        {/* 옵션 입력 필드 그리드 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            
                            {/* 옵션명 */}
                            <div className="lg:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">옵션명</label>
                                <input 
                                    type="text"
                                    value={opt.name}
                                    onChange={(e) => handleOptionChange(index, 'name', e.target.value)}
                                    placeholder="예: 블랙 / L 사이즈"
                                    className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-2.5 transition-all outline-none"
                                />
                            </div>

                            {/* 정렬순서 */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">정렬 순서</label>
                                <input 
                                    type="number"
                                    value={opt.sortOrder}
                                    onChange={(e) => handleOptionChange(index, 'sortOrder', Number(e.target.value))}
                                    className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-2.5 transition-all outline-none"
                                />
                            </div>

                            {/* 옵션 금액 */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">상품 가격 (원가)</label>
                                <div className="relative">
                                    <input 
                                        type="number"
                                        value={opt.price}
                                        onChange={(e) => handleOptionChange(index, 'price', Number(e.target.value))}
                                        className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-2.5 pr-8 transition-all outline-none"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">원</span>
                                </div>
                            </div>

{/* 할인 금액 주석 처리 
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">결제 가격 (할인가)</label>
                                <div className="relative">
                                    <input 
                                        type="number"
                                        value={opt.salePrice}
                                        onChange={(e) => handleOptionChange(index, 'salePrice', Number(e.target.value))}
                                        className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-2.5 pr-8 transition-all outline-none"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">원</span>
                                </div>
                            </div>
*/}

                            {/* 재고 */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">재고 수량</label>
                                <div className="relative">
                                    <input 
                                        type="number"
                                        value={opt.stock}
                                        onChange={(e) => handleOptionChange(index, 'stock', Number(e.target.value))}
                                        min="0"
                                        className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-2.5 pr-8 transition-all outline-none"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">개</span>
                                </div>
                            </div>

                            {/* 옵션 상태 */}
                            <div className="lg:col-span-3">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">옵션 상태</label>
                                <select
                                    value={opt.status}
                                    onChange={(e) => handleOptionChange(index, 'status', e.target.value)}
                                    className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-2.5 transition-all outline-none cursor-pointer appearance-none hover:bg-gray-50"
                                >
                                    {PRODUCT_STATUS_OPTIONS.map((status) => (
                                        <option key={status.value} value={status.value}>
                                            {status.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AddProductOption;