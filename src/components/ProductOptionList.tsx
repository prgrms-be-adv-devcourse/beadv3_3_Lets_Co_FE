import type { ProductOptionInfo } from "../types/productOptionInfo";

// 상태 값을 예쁜 한글 배지(Badge) UI로 변환하는 함수
const getStatusBadge = (status: string) => {
    switch (status) {
        case 'ON_SALE':
            return <span className="px-2.5 py-1 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-md">판매중</span>;
        case 'SOLD_OUT':
            return <span className="px-2.5 py-1 text-xs font-bold text-red-700 bg-red-50 border border-red-200 rounded-md">품절</span>;
        case 'HIDDEN':
            return <span className="px-2.5 py-1 text-xs font-bold text-gray-700 bg-gray-100 border border-gray-200 rounded-md">숨김</span>;
        default:
            return <span className="px-2.5 py-1 text-xs font-bold text-gray-700 bg-gray-100 border border-gray-200 rounded-md">{status}</span>;
    }
};

function ProductOptionList({ options }: { options: ProductOptionInfo[] }) {
    // 옵션이 없을 때의 빈 화면 처리
    if (!options || options.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center h-32 bg-gray-50 rounded-2xl border border-gray-100 text-gray-500">
                <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                <span className="text-sm font-medium">등록된 옵션이 없습니다.</span>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* 모바일 화면에서도 표가 깨지지 않도록 스크롤 처리 */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs text-gray-700 bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th scope="col" className="px-6 py-4 font-bold whitespace-nowrap">옵션명</th>
                            <th scope="col" className="px-6 py-4 font-bold whitespace-nowrap">금액</th>
                            <th scope="col" className="px-6 py-4 font-bold whitespace-nowrap">할인 금액</th>
                            <th scope="col" className="px-6 py-4 font-bold whitespace-nowrap">잔여 재고</th>
                            <th scope="col" className="px-6 py-4 font-bold whitespace-nowrap text-center">상태</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {options.map((opt, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900 min-w-[200px]">
                                    {opt.name}
                                    {/* 테스트용 코드는 작고 흐리게 표시 */}
                                    {opt.code && (
                                        <span className="block text-xs text-gray-400 mt-1 font-normal">{opt.code}</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {opt.price > 0 ? (
                                        <span className="text-gray-900">+{opt.price.toLocaleString()}원</span>
                                    ) : (
                                        <span className="text-gray-400">0원</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {opt.salePrice > 0 ? (
                                        <span className="text-red-500 font-medium">-{opt.salePrice.toLocaleString()}원</span>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`${opt.stock <= 0 ? 'text-red-500 font-medium' : 'text-gray-700'}`}>
                                        {opt.stock.toLocaleString()}개
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center whitespace-nowrap">
                                    {getStatusBadge(opt.status)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ProductOptionList;