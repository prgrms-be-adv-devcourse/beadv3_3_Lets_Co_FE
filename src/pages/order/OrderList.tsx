import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import type { OrderResponse } from "../../types/response/orderResponse";
import { getOrderList } from "../../api/orderApi";

function OrderList() {
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);

    const PAGE_SIZE = 10; 

    useEffect(() => {
        const getOrders = async () => {
            setIsLoading(true); 
            try {
                const orderArray = await getOrderList(page, PAGE_SIZE); 
                setOrders(orderArray); 
            } catch (error) {
                console.error("주문 목록 조회 실패:", error);
                alert("주문 내역을 불러오는데 실패했습니다.");
            } finally {
                setIsLoading(false);
            }
        };

        getOrders();
    }, [page]);

    const prev = () => {
        setPage((prevPage) => Math.max(0, prevPage - 1));
    };

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-bold text-gray-800">주문 목록</h2>
            </div>

            {isLoading && orders.length === 0 ? (
                <div className="flex justify-center items-center min-h-[40vh]">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-800"></div>
                </div>
            ) : orders.length === 0 ? (
                /* 빈 상태 - Product.tsx 스타일 적용 */
                <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-gray-500 font-medium">주문 내역이 없습니다.</p>
                </div>
            ) : (
                /* 주문 목록 리스트 */
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.orderCode} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:border-blue-200 transition-colors duration-300">
                            
                            {/* 주문 카드 헤더 */}
                            <div className="bg-gray-50 px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                <div className="text-sm">
                                    <span className="font-bold text-gray-800">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </span>
                                    <span className="hidden sm:inline-block mx-2 text-gray-300">|</span>
                                    <span className="text-gray-500 text-xs sm:text-sm">
                                        주문번호: {order.orderCode}
                                    </span>
                                </div>
                                <Link to={`/orders/${order.orderCode}`} className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
                                    주문 상세 보기 &gt;
                                </Link>
                            </div>

                            {/* 주문 상품 목록 */}
                            <ul className="divide-y divide-gray-100">
                                {order.orderItemList.map((item, index) => (
                                    <li key={`${order.orderCode}-${item.product.optionCode}-${index}`} className="p-5 flex flex-col md:flex-row gap-4 md:items-center hover:bg-gray-50/50 transition-colors">
                                        
                                        <div className="flex-grow">
                                            <Link to={`/products/${item.product.productCode}`} className="text-base font-bold text-gray-800 hover:text-blue-600 transition-colors line-clamp-1">
                                                {item.product.productName}
                                            </Link>
                                            
                                            {item.product.optionContent && (
                                                <p className="text-sm text-gray-500 mt-1.5">
                                                    [옵션] {item.product.optionContent}
                                                </p>
                                            )}
                                        </div>
                                        
                                        <div className="flex items-center gap-6 mt-2 md:mt-0 md:pl-6 md:border-l md:border-gray-100 text-sm">
                                            <div className="text-gray-500 w-16">
                                                수량 <span className="font-medium text-gray-800 ml-1">{item.quantity}개</span>
                                            </div>
                                            <div className="text-gray-500 w-28 text-right">
                                                금액 <span className="font-bold text-gray-800 ml-1 text-base">{item.amount.toLocaleString()}원</span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            {/* 총 결제 금액 푸터 */}
                            <div className="bg-white px-5 py-4 border-t border-gray-100 flex justify-end items-center gap-4">
                                <span className="text-sm text-gray-500 font-medium">총 결제금액</span>
                                <span className="text-xl font-bold text-gray-900">{order.itemsAmount.toLocaleString()}원</span>
                            </div>
                            
                        </div>
                    ))}
                </div>
            )}

            {/* 페이지네이션 */}
            {!isLoading && orders.length > 0 && (
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
                        onClick={() => setPage((prevPage) => prevPage + 1)}
                        disabled={orders.length < PAGE_SIZE} 
                        className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                        다음
                    </button>
                </div>
            )}
        </div>
    );
}

export default OrderList;