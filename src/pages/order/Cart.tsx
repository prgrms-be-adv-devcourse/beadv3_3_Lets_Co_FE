import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CartItemResponse } from "../../types/response/cartItemResponse";
import type { OrderRequest } from "../../types/request/orderRequest"; // 주문 요청 타입 추가
import { getCarts } from "../../api/cartApi";
import { order } from "../../api/orderApi"; // 주문 API 추가

function Cart() {
    const [cartItem, setCartItem] = useState<CartItemResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCartList = async () => {
            try {
                const response = await getCarts();
                if (response && response.data) {
                    setCartItem(response.data);
                } else {
                     setCartItem([]);
                }
            } catch (error) {
                console.error("장바구니 조회 실패", error);
                alert("장바구니 정보를 불러올 수 없습니다.");
            } finally {
                setLoading(false);
            }
        };
        fetchCartList();
    }, []); 

    const totalAmount = cartItem.reduce((acc, cur) => acc + cur.amount, 0);

    const handleOrder = async () => {
        if (cartItem.length === 0) {
            alert("주문할 상품이 없습니다.");
            return;
        }

        const orderData: OrderRequest = {
            orderType: "CART",
            productInfo: null
        };

        try {
            const response = await order(orderData);

            const orderCode = response.data.orderCode;

            if (!orderCode) {
                console.error("주문 번호 누락:", response);
                alert("주문 처리에 실패했습니다. (주문 번호 없음)");
                return;
            }

            navigate("/payment", { 
                state: { 
                    orderCode: orderCode,
                    orderType: "CART", 
                    cartItems: cartItem 
                } 
            });

        } catch (error) {
            console.error("주문 생성 실패", error);
            alert("주문 생성 중 오류가 발생했습니다.");
        }
    };

    if (loading) return <div>로딩중...</div>;

    return (
        <div>
            <h1>장바구니</h1>
            {cartItem.length === 0 ? (
                <p>장바구니가 비어있습니다.</p>
            ) : (
                <>
                    {cartItem.map((item, index) => (
                        <div key={item.product.optionCode || index}>
                            <div>
                                <p>제품명: {item.product.productName}</p>
                                <p>옵션: {item.product.optionContent}</p>
                                <p>단가: {item.product.price.toLocaleString()}원</p>
                            </div>
                            <div>
                                <p>개수: {item.quantity}</p>
                                <p>금액: {item.amount.toLocaleString()}원</p>
                            </div>
                            
                            <hr/>
                        </div>
                    ))}
                    <hr />
                    <div>
                        <p>총 결제 예정 금액: {totalAmount.toLocaleString()}원</p>
                    </div>
                    <div>
                         <button onClick={handleOrder}>전체 상품 주문하기</button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;