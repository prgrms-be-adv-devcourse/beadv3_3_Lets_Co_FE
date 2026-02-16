import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Search from "../../components/Search";
import { getOrderList } from "../../api/orderApi";
import type { OrderResponse } from "../../types/response/orderResponse";

function Order() {

    const [loading, setLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [page, setPage] = useState(0);
    const [orders, setOrders] = useState<OrderResponse[]>([]);

    const PAGE_SIZE = 5;

    const fetchOrders = async (keyword: string, page: number) => {
        try {
            setLoading(true);
            const data = await getOrderList(keyword, page, PAGE_SIZE); 
            setOrders(data);
        } catch (error) {
            console.error("주문 로딩 실패:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchOrders(searchKeyword, page);
    }, [page]); 

    const handleSearch = (keyword: string) => {
        setSearchKeyword(keyword);
        if (page !== 0) {
            setPage(0);
        } else {
            fetchOrders(keyword, 0);
        }
    }

    return (
        <div>
            <h1>주문 리스트</h1>
            <Search onSearch={handleSearch} />

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
        </div>
    );
}

export default Order;