import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrderDetails } from "../../api/orderApi";
import type { OrderResponse } from "../../types/response/orderResponse";
import { refund } from "../../api/paymentApi";

function OrderDetails() {
    const { productCode } = useParams<{ productCode: string }>(); 

    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState<OrderResponse | null>(null);

    const fetchOrder = async (code: string) => {
        try {
            setLoading(true);
            const data = await getOrderDetails(code);
            setOrder(data);
        } catch (error) {
            console.log("주문 정보 조회 실패: ", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (productCode) {
            fetchOrder(productCode);
        }
    }, [productCode]);


    const handleRefund = async (orderCode: string) => {
        try {
            await refund(orderCode);
        } catch (error) {
            console.log("환불 실패: ", error);
        }
    }

    if (loading) return <div>로딩 중...</div>;
    if (!order) return <div>주문 정보를 찾을 수 없습니다.</div>;

    return (
        <div>
            <h1>주문 상세 정보</h1>

            <div>
                <h3>주문 번호: {order.orderCode}</h3>
                <h3>총 결제 금액: {order.itemsAmount.toLocaleString()}원</h3>
            </div>

            <div>
                <h4>주문 상품 목록 ({order.orderItemList.length}개)</h4>
                
                {order.orderItemList.map((item, index) => (
                    <div 
                        key={`${item.product.productCode}-${index}`} 
                    >
                        <div>
                            <label><strong>제품명:</strong> </label>
                            <Link to={`/products/${item.product.optionCode}`}>
                                {item.product.productName}
                            </Link>
                        </div>

                        <div>
                            <label><strong>옵션:</strong> </label>
                            <span>{item.product.optionContent}</span>
                        </div>

                        <div>
                            <label><strong>단가:</strong> </label>
                            <span>{item.product.price.toLocaleString()}원</span>
                        </div>

                        <div>
                            <label><strong>개수:</strong> </label>
                            <span>{item.quantity}개</span>
                        </div>

                        <div>
                            <label><strong>상품 총액:</strong> </label>
                            <span>{item.amount.toLocaleString()}원</span>
                        </div>
                    </div>
                ))}

                <button onClick={() => handleRefund(order.orderCode)}>
                    상품 환불
                </button>
            </div>
        </div>
    );
}

export default OrderDetails;