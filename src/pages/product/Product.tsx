import { useEffect, useState } from "react";
import { getProducts } from "../../api/productApi";
import { Link } from "react-router-dom";
import { PRODUCT_STATUS_LABELS } from "../../types/productStatus";
import type { ProductListResponse } from "../../types/response/productListResponse";

interface ProductProps {
  searchKeyword: string;
}

export default function Product({ searchKeyword }: ProductProps) {
    const [products, setProducts] = useState<ProductListResponse[]>([]); 
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);

    const PAGE_SIZE = 12; 

    const fetchProducts = async (keyword: string, pageNum: number) => {
        try {
            setLoading(true);
            const data = await getProducts(keyword, pageNum, PAGE_SIZE);
            
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
        setPage(0);
    }, [searchKeyword]);

    useEffect(() => {
        fetchProducts(searchKeyword, page);
    }, [searchKeyword, page]); 

    const prev = () => { 
        setPage((prev) => Math.max(0, prev - 1))
    }

    // ON_SALE(판매 중)과 SOLD_OUT(품절) 상태인 상품만 필터링
    const visibleProducts = products.filter(
        (product) => product.status === "ON_SALE" || product.status === "SOLD_OUT"
    );
    
    return (
        <div className="max-w-7xl mx-auto py-6">
            <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-bold text-gray-800">상품 리스트</h2>
                {searchKeyword && (
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        "{searchKeyword}" 검색 결과
                    </span>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center items-center min-h-[40vh]">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-800"></div>
                </div>
            ) : (
                <>
                    {visibleProducts.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <p className="text-gray-500 font-medium">검색 결과가 없습니다.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {visibleProducts.map((product) => (
                                <Link 
                                    to={`/products/${product.productsCode}`} 
                                    key={product.productsCode}
                                    className="group flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-blue-200 transition-all duration-300"
                                >
                                    {/* 상품 이미지 영역 */}
                                    <div className="aspect-square bg-gray-50 relative overflow-hidden">
                                        {product.imageUrl ? (
                                            <img 
                                                src={product.imageUrl} 
                                                alt={product.name}
                                                className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                                                    product.status === "SOLD_OUT" ? "opacity-60" : ""
                                                }`}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                                                이미지 없음
                                            </div>
                                        )}
                                        
                                        {/* 품절 배지 */}
                                        {product.status === "SOLD_OUT" && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                                                <span className="bg-red-500 text-white px-4 py-1.5 text-sm font-bold rounded-full shadow-lg">
                                                    {PRODUCT_STATUS_LABELS[product.status] || "품절"}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* 상품 정보 영역 */}
                                    <div className="p-5 flex flex-col flex-grow">
                                        
                                        <h3 className="font-bold text-gray-800 text-base mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                            {product.name}
                                        </h3>
                                        
                                        <div className="mt-auto flex items-end justify-between">
                                            <div className="flex flex-col">
                                                {product.salePrice > 0 && product.salePrice < product.price ? (
                                                    <>
                                                        <span className="text-gray-400 line-through text-xs mb-0.5">
                                                            {product.price.toLocaleString()}원
                                                        </span>
                                                        <span className="text-red-500 font-bold text-lg">
                                                            {product.salePrice.toLocaleString()}원
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-gray-800 font-bold text-lg">
                                                        {product.price.toLocaleString()}원
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded-md">
                                                조회 {product.viewCount}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* 페이지네이션 */}
            {!loading && products.length > 0 && (
                <div className="mt-12 flex items-center justify-center gap-4">
                    <button 
                        onClick={prev}
                        disabled={page === 0}
                        className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                        이전
                    </button>

                    <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-4 py-2 rounded-lg">
                        {page + 1} 페이지
                    </span>

                    <button 
                        onClick={() => setPage((prev) => prev + 1)}
                        disabled={products.length < PAGE_SIZE} 
                        className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                        다음
                    </button>
                </div>
            )}
        </div>
    );
}