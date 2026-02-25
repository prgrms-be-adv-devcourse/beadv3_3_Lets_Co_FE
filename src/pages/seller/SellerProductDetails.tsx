import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSellerProductDetails, deleteSellerProduct } from "../../api/sellerApi";
import type { SellerProductDetailsResponse } from "../../types/response/sellerProductDetailsResponse";
import { PRODUCT_STATUS_LABELS } from "../../types/productStatus";

function SellerProductDetails() {
    const { code } = useParams<{ code: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState<SellerProductDetailsResponse | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!code) {
                setLoading(false);
                return;
            }

            try {
                const data = await getSellerProductDetails(code);
                setProduct(data);
            } catch (error) {
                console.error("상품 상세 조회 실패:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [code]);

    const handleDelete = async () => {
        if (!code) return;
        
        if (window.confirm("정말로 이 상품을 삭제하시겠습니까?")) {
            try {
                await deleteSellerProduct(code);
                alert("상품이 성공적으로 삭제되었습니다.");
                navigate(-1); 
            } catch (error) {
                console.error("상품 삭제 실패:", error);
                alert("상품 삭제 중 오류가 발생했습니다.");
            }
        }
    };

    if (loading) return <div className="text-center py-20 text-gray-500 text-lg font-medium">데이터를 불러오는 중입니다...</div>;
    if (!product) return <div className="text-center py-20 text-gray-500 text-lg font-medium">상품 정보가 없습니다.</div>;

    // 별점 렌더링 함수 (리뷰)
    // const renderStars = (score: number) => {
    //     const validScore = Math.max(0, Math.min(5, score)); // 0~5 사이 보장
    //     return (
    //         <span className="text-yellow-400 text-lg tracking-widest">
    //             {'★'.repeat(validScore)}{'☆'.repeat(5 - validScore)}
    //         </span>
    //     );
    // };

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8 mb-12">
            {/* 상단 헤더 및 버튼 */}
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h1 className="text-2xl font-bold text-gray-800">상품 상세 정보</h1>
                <div className="flex gap-3">
                    <button 
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition shadow-sm"
                        onClick={() => navigate(-1)}
                    >
                        목록으로
                    </button>
                    <button 
                        className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 font-medium rounded-md hover:bg-red-100 transition shadow-sm"
                        onClick={handleDelete} 
                    >
                        삭제하기
                    </button>
                </div>
            </div>

            {/* 메인 정보 영역 (이미지 & 기본 정보 2단 레이아웃) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                {/* 이미지 영역 */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">상품 이미지</h3>
                    <div className="flex flex-wrap gap-4">
                        {product.images && product.images.length > 0 ? (
                            product.images.map((img, idx) => (
                                <div key={idx} className="border border-gray-200 rounded-md overflow-hidden shadow-sm">
                                    <img 
                                        src={img.urls} 
                                        alt={`product-${idx}`} 
                                        className="w-48 h-48 object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="w-48 h-48 bg-gray-100 border border-gray-200 rounded-md flex items-center justify-center">
                                <span className="text-gray-400 text-sm">등록된 이미지 없음</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* 기본 정보 영역 */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">기본 정보</h3>
                    <div className="bg-gray-50 p-6 rounded-md border border-gray-200 flex flex-col gap-4 text-sm text-gray-700">
                        <div className="flex">
                            <span className="w-24 font-bold text-gray-800">상품 코드</span>
                            <span className="font-mono text-gray-600">{product.productsCode}</span>
                        </div>
                        <div className="flex">
                            <span className="w-24 font-bold text-gray-800">상품명</span>
                            <span className="font-medium text-blue-600">{product.name}</span>
                        </div>
                        <div className="flex">
                            <span className="w-24 font-bold text-gray-800">카테고리</span>
                            <span>
                                {product.category && product.category.length > 0 
                                    ? product.category.map(c => c.categoryName).join(' > ') 
                                    : '없음'}
                            </span>
                        </div>
                        <div className="flex">
                            <span className="w-24 font-bold text-gray-800">IP</span>
                            <span>
                                {product.ip && product.ip.length > 0 
                                    ? product.ip.map(i => i.categoryName).join(' > ') 
                                    : '없음'}
                            </span>
                        </div>
                        <div className="flex">
                            <span className="w-24 font-bold text-gray-800">가격</span>
                            <span className="font-semibold text-gray-900">{product.price?.toLocaleString()}원</span>
                        </div>
                        <div className="flex">
                            <span className="w-24 font-bold text-gray-800">재고</span>
                            <span>{product.stock?.toLocaleString()}개</span>
                        </div>
                        <div className="flex items-center">
                            <span className="w-24 font-bold text-gray-800">상태</span>
                            <span className="px-3 py-1 bg-white text-gray-700 text-xs font-bold rounded-full border border-gray-300 shadow-sm">
                                {PRODUCT_STATUS_LABELS[product.status] || product.status}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 상품 설명 영역 */}
            <div className="mb-10">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">상품 설명</h3>
                <div className="bg-gray-50 p-6 rounded-md border border-gray-200 text-gray-700 whitespace-pre-wrap leading-relaxed min-h-[100px]">
                    {product.description || <span className="text-gray-400 italic">등록된 상품 설명이 없습니다.</span>}
                </div>
            </div>

{/* 리뷰 영역
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                    고객 리뷰 
                    <span className="text-blue-600 text-sm bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                        {product.reviews?.length || 0}
                    </span>
                </h3>
                
                <div className="space-y-4">
                    {product.reviews && product.reviews.length > 0 ? (
                        product.reviews.map((review, idx) => (
                            <div key={idx} className="bg-white p-5 rounded-md border border-gray-200 shadow-sm hover:shadow-md transition">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-3">
                                        {renderStars(review.evaluation)}
                                        <span className="text-sm font-medium text-gray-700">{review.evaluation}점</span>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                    {review.content}
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 bg-gray-50 rounded-md border border-gray-200">
                            <p className="text-gray-500">아직 등록된 리뷰가 없습니다.</p>
                        </div>
                    )}
                </div>
            </div>
 */}
        </div>
    );
}

export default SellerProductDetails;