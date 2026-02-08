import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CartItemResponse } from "../../types/response/cartItemResponse";
import { getCarts } from "../../api/cartApi"; 

export default function Cart() {
    const navigate = useNavigate();

    const [cartItem, setCartItem] = useState<CartItemResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

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

    const handleOrder = () => {
        if (cartItem.length === 0) {
            alert("주문할 상품이 없습니다.");
            return;
        }

        navigate("/payment", { 
            state: { 
                orderType: "CART", 
                cartItems: cartItem
            } 
        });
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