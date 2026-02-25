import { useEffect, useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import { getSellerProductList } from "../../api/sellerApi";
import { getCategory, getIP } from "../../api/productApi";
import type { ProductListResponse } from "../../types/response/productListResponse";
import type { CategorySortedResponse } from "../../types/response/categorySortedResponse";
import { PRODUCT_STATUS_LABELS } from "../../types/productStatus";

const findNameByCode = (nodes: CategorySortedResponse[], targetCode: string): string => {
    if (!targetCode) return ''; 
    
    for (const node of nodes) {
        if (node.categoryCode === targetCode) {
            return node.categoryName; 
        }
        if (node.children && node.children.length > 0) {
            const foundName = findNameByCode(node.children, targetCode);
            if (foundName) return foundName;
        }
    }
    return '';
};

function SellerProduct() {
    const navigate = useNavigate();

    const [products, setProducts] = useState<ProductListResponse[]>([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const PAGE_SIZE = 5;
    
    const [searchKeyword, setSearchKeyword] = useState('');
    const [categoryCode, setCategoryCode] = useState('');
    const [ipCode, setIpCode] = useState('');
    
    const [categories, setCategories] = useState<CategorySortedResponse[]>([]);
    const [ips, setIps] = useState<CategorySortedResponse[]>([]);

    useEffect(() => {
        const fetchFilterData = async () => {
            try {
                const [categoryData, ipData] = await Promise.all([
                    getCategory(),
                    getIP()
                ]);
                setCategories(categoryData);
                setIps(ipData);
            } catch (error) {
                console.error("분류 데이터 불러오기 실패:", error);
            }
        };
        fetchFilterData();
    }, []);

    const fetchProducts = async (pageNum: number) => {
        try {
            setLoading(true);
            
            const categoryName = findNameByCode(categories, categoryCode);
            const ipName = findNameByCode(ips, ipCode);
            
            const data = await getSellerProductList(
                pageNum, 
                PAGE_SIZE, 
                searchKeyword, 
                categoryName, 
                ipName
            );
            
            if (data && data.items) {
                setProducts(data.items);
            }
        } catch (error) {
            const err = error as any; 
            if (err.response && err.response.status === 404) {
                setProducts([]); 
                return; 
            }
            console.error("상품 로딩 실패:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(page);
    }, [page, categories, ips]);

    const handleSearch = () => {
        if (page === 0) {
            fetchProducts(0);
        } else {
            setPage(0);
        }
    };

    const prev = () => {
        setPage((prev) => Math.max(0, prev - 1));
    };

    // 트리 구조의 데이터를 select option으로 평탄화(Flatten)하는 재귀 함수 (카테고리, 아이피 공용)
    const renderSelectOptions = (items: CategorySortedResponse[], depth: number = 0) => {
        let options: JSX.Element[] = [];
        
        items.forEach(item => {
            const indent = "\u00A0\u00A0\u00A0".repeat(depth);
            const prefix = depth > 0 ? `${indent}└ ` : "";
            
            options.push(
                <option key={item.categoryCode} value={item.categoryCode} className="py-1">
                    {prefix}{item.categoryName}
                </option>
            );
            
            if (item.children && item.children.length > 0) {
                options = options.concat(renderSelectOptions(item.children, depth + 1));
            }
        });
        
        return options;
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
                제품 관리 (판매자)
            </h1>

            {/* 필터 및 검색 영역 */}
            <div className="flex flex-wrap gap-6 mb-8 bg-gray-50 p-6 rounded-md border border-gray-200">
                {/* 상품명 검색 */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">상품명 검색</label>
                    <input 
                        type="text" 
                        className="w-56 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={searchKeyword} 
                        onChange={(e) => setSearchKeyword(e.target.value)} 
                        placeholder="검색어 입력" 
                    />
                </div>

                {/* 카테고리 선택 (<select> 태그로 변경) */}
                <div className="flex flex-col gap-2 min-w-[200px]">
                    <label className="text-sm font-semibold text-gray-700">카테고리 선택</label>
                    <select
                        value={categoryCode}
                        onChange={(e) => setCategoryCode(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none"
                    >
                        <option value="">전체 카테고리</option>
                        {renderSelectOptions(categories)}
                    </select>
                </div>

                {/* 아이피 선택 (<select> 태그로 변경) */}
                <div className="flex flex-col gap-2 min-w-[200px]">
                    <label className="text-sm font-semibold text-gray-700">아이피 선택</label>
                    <select
                        value={ipCode}
                        onChange={(e) => setIpCode(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none"
                    >
                        <option value="">전체 아이피</option>
                        {renderSelectOptions(ips)}
                    </select>
                </div>

                <div className="flex items-end">
                    <button 
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200 shadow-sm"
                        onClick={handleSearch}
                    >
                        검색
                    </button>
                </div>
            </div>

            {/* 테이블 영역 (카테고리, 판매가 제외) */}
            {loading ? (
                <div className="text-center py-12 text-gray-500 text-lg font-medium">데이터를 불러오는 중입니다...</div>
            ) : (
                <div className="overflow-x-auto rounded-md border border-gray-200">
                    <table className="w-full text-sm text-left border-collapse bg-white">
                        <thead className="bg-gray-100 text-gray-700 uppercase">
                            <tr>
                                <th className="px-4 py-3 border-b border-gray-200 text-center w-24">이미지</th>
                                <th className="px-4 py-3 border-b border-gray-200 text-center w-32">상품코드</th>
                                <th className="px-4 py-3 border-b border-gray-200">상품명</th>
                                <th className="px-4 py-3 border-b border-gray-200 text-right w-32">가격</th>
                                <th className="px-4 py-3 border-b border-gray-200 text-center w-28">상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                                        검색 결과가 없습니다.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.productsCode} className="hover:bg-gray-50 border-b border-gray-200 transition">
                                        <td className="px-4 py-3 text-center align-middle">
                                            {product.imageUrl ? (
                                                <img 
                                                    src={product.imageUrl} 
                                                    alt={product.name} 
                                                    className="w-12 h-12 object-cover rounded shadow-sm mx-auto border border-gray-200"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-100 rounded mx-auto flex items-center justify-center border border-gray-200">
                                                    <span className="text-gray-400 text-xs">없음</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center text-gray-500 font-mono text-xs">
                                            {product.productsCode}
                                        </td>
                                        <td 
                                            className="px-4 py-3 font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                                            onClick={() => navigate(`/seller/product/${product.productsCode}`)}
                                        >
                                            {product.name}
                                        </td>
                                        <td className="px-4 py-3 text-right text-gray-800 font-semibold">
                                            {product.price.toLocaleString()}원
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="px-3 py-1 bg-white text-gray-700 text-xs font-medium rounded-full border border-gray-300 shadow-sm">
                                                {PRODUCT_STATUS_LABELS[product.status] || product.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* 페이지네이션 영역 */}
            <div className="flex justify-center items-center gap-4 mt-8">
                <button 
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
                    onClick={prev} 
                    disabled={page === 0}
                >
                    이전
                </button>
                <span className="text-gray-600 font-medium bg-gray-50 px-4 py-2 rounded-md border border-gray-200">
                    {page + 1} 페이지
                </span>
                <button 
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
                    onClick={() => setPage((prev) => prev + 1)} 
                    disabled={products.length < PAGE_SIZE}
                >
                    다음
                </button>
            </div>
        </div>
    );
}

export default SellerProduct;