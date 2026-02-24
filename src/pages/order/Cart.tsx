import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CartItemResponse } from "../../types/response/cartItemResponse"; 
import type { OrderRequest } from "../../types/request/orderRequest";
import { order } from "../../api/orderApi";
import { getCartList, plusCart, minusCart, deleteCart } from "../../api/cartApi";

function Cart() {
    const [cartItem, setCartItem] = useState<CartItemResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCartList = async () => {
            try {
                const response = await getCartList();
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

    // 수량 추가 핸들러
    const handlePlus = async (optionCode: string, currentQuantity: number) => {
        if (currentQuantity >= 100) {
            alert("최대 구매 가능 수량은 100개입니다.");
            return; 
        }

        try {
            const response = await plusCart(optionCode);
            if (response && response.data) {
                setCartItem(prev => prev.map(item => 
                    item.product.optionCode === optionCode ? response.data : item
                ));
            }
        } catch (error) {
            console.error(error);
            alert("수량 변경에 실패했습니다.");
        }
    };

    // 수량 감소 핸들러
    const handleMinus = async (optionCode: string, currentQuantity: number) => {
        if (currentQuantity <= 1) {
            alert("최소 주문 수량은 1개입니다.");
            return;
        }
        
        try {
            const response = await minusCart(optionCode);
            if (response && response.data) {
                setCartItem(prev => prev.map(item => 
                    item.product.optionCode === optionCode ? response.data : item
                ));
            }
        } catch (error) {
            console.error(error);
            alert("수량 변경에 실패했습니다.");
        }
    };

    // 장바구니 상품 삭제 핸들러
    const handleDelete = async (optionCode: string) => {
        if (!window.confirm("이 상품을 장바구니에서 삭제하시겠습니까?")) {
            return;
        }

        try {
            await deleteCart(optionCode);
            setCartItem(prev => prev.filter(item => item.product.optionCode !== optionCode));
        } catch (error) {
            console.error(error);
            alert("삭제에 실패했습니다.");
        }
    };

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

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="text-gray-500 font-medium">장바구니를 불러오는 중입니다...</div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl mx-auto py-10 px-4 sm:px-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                장바구니
            </h1>

            {cartItem.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
                    <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    <p className="text-gray-500 text-lg font-medium">장바구니가 비어있습니다.</p>
                    <button 
                        onClick={() => navigate("/")}
                        className="mt-6 px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    >
                        쇼핑 계속하기
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* 장바구니 상품 목록 */}
                    <div className="space-y-4">
                        {cartItem.map((item, index) => (
                            <div 
                                key={item.product.optionCode || index} 
                                className="relative bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow pr-12 md:pr-6"
                            >
                                {/* 상품 정보 */}
                                <div className="flex-1 space-y-2">
                                    <h3 className="text-lg font-bold text-gray-900">
                                        {item.product.productName}
                                    </h3>
                                    <p className="text-sm text-gray-500 bg-gray-50 inline-block px-3 py-1 rounded-md">
                                        옵션: {item.product.optionContent}
                                    </p>
                                    <p className="text-sm text-gray-600 font-medium">
                                        단가: {item.product.price.toLocaleString()}원
                                    </p>
                                </div>

                                {/* 수량 컨트롤 및 총 금액 */}
                                <div className="flex flex-col md:items-end w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 gap-3">
                                    
                                {/* 수량 조절 버튼 영역 */}
                                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white w-fit">
                                    <button 
                                        onClick={() => handleMinus(item.product.optionCode, item.quantity)}
                                        disabled={item.quantity <= 1} // 1개 이하일 때 버튼 비활성화 (회색 처리)
                                        className="w-8 h-8 flex justify-center items-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    >
                                        -
                                    </button>
                                    <span className="w-12 h-8 flex justify-center items-center text-sm font-semibold text-gray-900 border-x border-gray-200">
                                        {item.quantity}
                                    </span>
                                    <button 
                                        onClick={() => handlePlus(item.product.optionCode, item.quantity)}
                                        disabled={item.quantity >= 100} // 100개 이상일 때 버튼 비활성화 (회색 처리)
                                        className="w-8 h-8 flex justify-center items-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    >
                                        +
                                    </button>
                                </div>

                                    <div className="text-xl font-bold text-blue-600">
                                        {item.amount.toLocaleString()}원
                                    </div>
                                </div>

                                {/* 삭제 버튼 (우측 상단 절대 배치 또는 유동적 배치) */}
                                <button 
                                    onClick={() => handleDelete(item.product.optionCode)}
                                    className="absolute top-4 right-4 md:static md:ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    title="삭제"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* 결제 요약 및 주문 버튼 영역 */}
                    <div className="bg-gray-50 p-6 sm:p-8 rounded-2xl border border-gray-200 mt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex flex-col gap-1 w-full md:w-auto">
                            <span className="text-gray-500 font-medium">총 결제 예정 금액</span>
                            <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                                {totalAmount.toLocaleString()}원
                            </span>
                        </div>
                        
                        <button 
                            onClick={handleOrder}
                            className="w-full md:w-auto px-8 py-4 bg-gray-900 text-white text-lg font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
                        >
                            전체 상품 주문하기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;