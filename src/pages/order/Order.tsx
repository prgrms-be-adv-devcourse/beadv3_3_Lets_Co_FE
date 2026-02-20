import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrderList } from "../../api/orderApi";
import type { OrderResponse } from "../../types/response/orderResponse";

function Order() {

    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [orders, setOrders] = useState<OrderResponse[]>([]);

    const PAGE_SIZE = 5;

    const fetchOrders = async (page: number) => {
        try {
            setLoading(true);
            const data = await getOrderList(page, PAGE_SIZE); 
            setOrders(data);
        } catch (error) {
            console.error("주문 로딩 실패:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchOrders(page);
    }, [page]); 

    const handlePrevPage = () => {
        if (page > 0) setPage(page - 1);
    };

    const handleNextPage = () => {
        setPage(page + 1);
    };

    return (
        <div>
            <h1>주문 리스트</h1>

            {loading ? (
                <div>로딩 중...</div>
            ) : (
                <div>
                    {orders.length === 0 ? (
                        <p>주문이 없습니다.</p>
                    ) : (
                        orders.map((order) => (
                            <div key={order.orderCode}>
                                
                                <div>
                                    <label>주문 코드: </label>
                                    <Link to={`/orders/${order.orderCode}`}>
                                        <span>{order.orderCode}</span>
                                    </Link>
                                </div>

                                {order.orderItemList.map((item, index) => (
                                    <div key={`${order.orderCode}-${index}`}>
                                        <div>
                                            <label>상품명: </label>
                                            <Link to={`/products/${item.product.optionCode}`}>
                                                {item.product.productName}
                                            </Link>
                                        </div>
                                        <div>
                                            <label>옵션: </label>
                                            <span>{item.product.optionContent}</span>
                                        </div>
                                        <div>
                                            <label>단가: </label>
                                            <span>{item.product.price.toLocaleString()}원</span>
                                        </div>
                                        <div>
                                            <label>개수: </label>
                                            <span>{item.quantity}개</span>
                                        </div>
                                        <div>
                                            <label>금액: </label>
                                            <span>{item.amount.toLocaleString()}원</span>
                                        </div>
                                    </div>
                                ))}

                                <div>
                                    <label>총 결제 금액: </label>
                                    <span>{order.itemsAmount.toLocaleString()}원</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {!loading && orders.length > 0 && (
                <div>
                    <button 
                        onClick={handlePrevPage} 
                        disabled={page === 0}
                    >
                        이전 페이지
                    </button>
                    <span>{page + 1} 페이지</span>
                    <button 
                        onClick={handleNextPage} 
                        disabled={orders.length < PAGE_SIZE}
                    >
                        다음 페이지
                    </button>
                </div>
            )}
        </div>
    );
}

export default Order;