import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getOrderDetails } from "../../api/orderApi";
import { refund } from "../../api/paymentApi";
import type { OrderResponse } from "../../types/response/orderResponse";

function OrderDetails() {
    const { orderCode } = useParams<{ orderCode: string }>(); 
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState<OrderResponse | null>(null);

    useEffect(() => {
        const fetchOrder = async (code: string) => {
            try {
                setLoading(true);
                const data = await getOrderDetails(code);
                setOrder(data);
            } catch (error) {
                console.error("주문 정보 조회 실패: ", error);
            } finally {
                setLoading(false);
            }
        };

        if (orderCode) {
            fetchOrder(orderCode);
        }
    }, [orderCode]);

    // 환불 처리 핸들러
    const handleRefund = async (code: string) => {
        if (!window.confirm("정말로 이 주문을 환불하시겠습니까?")) return;

        try {
            await refund(code);
            alert("환불이 성공적으로 처리되었습니다.");
            navigate(-1); // 환불 후 이전 페이지로 이동
        } catch (error) {
            console.error("환불 실패: ", error);
            alert("환불 처리에 실패했습니다.");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[40vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-800"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="max-w-4xl mx-auto py-12 px-4">
                <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-gray-500 font-medium mb-4">주문 정보를 찾을 수 없습니다.</p>
                    <button 
                        onClick={() => navigate(-1)} 
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        뒤로 가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            
            {/* 상단 헤더 영역 */}
            <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-bold text-gray-800">주문 상세 정보</h2>
                <button 
                    onClick={() => navigate(-1)}
                    className="text-sm text-gray-500 hover:text-gray-800 transition-colors bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md font-medium"
                >
                    목록으로 돌아가기
                </button>
            </div>

            <div className="space-y-6">
                
                {/* 주문 정보 요약 카드 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <h3 className="text-lg font-bold text-gray-800">주문 요약</h3>
                        <span className="text-sm text-gray-500 font-medium">주문 번호: {order.orderCode}</span>
                    </div>
                    <div className="px-6 py-5">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-medium">총 결제 금액</span>
                            <span className="text-2xl font-extrabold text-blue-600">{order.itemsAmount.toLocaleString()}원</span>
                        </div>
                    </div>
                </div>

                {/* 주문 상품 목록 카드 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <h4 className="text-base font-bold text-gray-800">
                            주문 상품 목록 <span className="text-blue-600 ml-1">({order.orderItemList.length}개)</span>
                        </h4>
                    </div>
                    
                    <ul className="divide-y divide-gray-100">
                        {order.orderItemList.map((item, index) => (
                            <li key={`${item.product.productCode}-${index}`} className="p-6 hover:bg-gray-50/50 transition-colors">
                                <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                                    
                                    {/* 상품 기본 정보 */}
                                    <div className="flex-grow">
                                        <div className="mb-2">
                                            <Link 
                                                to={`/products/${item.product.productCode}`} 
                                                className="text-lg font-bold text-gray-800 hover:text-blue-600 transition-colors"
                                            >
                                                {item.product.productName}
                                            </Link>
                                        </div>
                                        {item.product.optionContent && (
                                            <div className="inline-block bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-md mb-2">
                                                옵션: {item.product.optionContent}
                                            </div>
                                        )}
                                        <div className="text-sm text-gray-500 mt-1">
                                            <span className="inline-block w-12 font-medium">단가</span> 
                                            {item.product.price.toLocaleString()}원
                                        </div>
                                    </div>

                                    {/* 수량 및 상품 총액 */}
                                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-gray-100 pt-4 sm:pt-0 sm:pl-6 min-w-[120px]">
                                        <div className="text-sm text-gray-500 mb-1">
                                            수량 <span className="font-bold text-gray-800 ml-1">{item.quantity}개</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-medium text-gray-500 mr-2">합계</span>
                                            <span className="text-lg font-bold text-gray-900">{item.amount.toLocaleString()}원</span>
                                        </div>
                                    </div>
                                    
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 하단 액션 버튼 (환불) */}
                <div className="flex justify-end pt-4">
                    <button 
                        onClick={() => handleRefund(order.orderCode)}
                        className="px-6 py-3 bg-red-50 text-red-600 font-bold rounded-lg border border-red-200 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm"
                    >
                        주문 전체 환불하기
                    </button>
                </div>

            </div>
        </div>
    );
}

export default OrderDetails;