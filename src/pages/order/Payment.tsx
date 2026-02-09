import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type { CardInfo } from "../../types/cardInfo";
import { order } from "../../api/orderApi";
import { getProduct } from "../../api/productApi";
import type { OrderRequest } from "../../types/request/orderRequest";

// 화면 표시용 타입 (UI 전용)
interface OrderItemView {
    productName: string;
    optionName: string;
    price: number;
    quantity: number;
    totalPrice: number;
    productCode?: string;
    optionCode?: string;
}

function Payment() {
    const location = useLocation();
    const navigate = useNavigate();
    
    const stateParams = location.state as { 
        orderType: "DIRECT" | "CART";
        // DIRECT용
        productCode?: string; 
        optionCode?: string; 
        quantity?: number; 
        // CART용
        cartItems?: any[]; 
    } | null;

    // 화면에 보여줄 주문 상품 목록
    const [orderList, setOrderList] = useState<OrderItemView[]>([]);
    const [loading, setLoading] = useState(true);

    // 배송지 정보
    const [recipient, setRecipient] = useState("");
    const [address, setAddress] = useState("");
    const [addressDetail, setAddressDetail] = useState("");
    const [phone, setPhone] = useState("");

    // 결제 수단 및 카드 정보
    const [paymentType, setPaymentType] = useState<"CARD" | "DEPOSIT">("CARD");
    const [cardName, setCardName] = useState("");
    const [cardBrand, setCardBrand] = useState("VISA");
    const [expMonth, setExpMonth] = useState("");
    const [expYear, setExpYear] = useState("");
    const [cardToken] = useState(""); 

    useEffect(() => {
        if (!stateParams) {
            alert("잘못된 접근입니다.");
            navigate(-1);
            return;
        }

        const fetchOrderData = async () => {
            try {
                if (stateParams.orderType === "DIRECT") {
                    if (!stateParams.productCode || !stateParams.optionCode) throw new Error("필수 정보 누락");

                    const data = await getProduct(stateParams.productCode);
                    const selectedOption = data.options.find(opt => opt.code === stateParams.optionCode);

                    if (!selectedOption) throw new Error("옵션 정보 없음");

                    const price = selectedOption.stock <= 0 ? 0 : (selectedOption.salePrice > 0 ? selectedOption.salePrice : selectedOption.price);
                    const qty = stateParams.quantity || 1;

                    setOrderList([{
                        productName: data.name,
                        optionName: selectedOption.name,
                        price: price,
                        quantity: qty,
                        totalPrice: price * qty,
                        productCode: data.productsCode,
                        optionCode: selectedOption.code
                    }]);
                } 
                else if (stateParams.orderType === "CART") {
                    if (!stateParams.cartItems || stateParams.cartItems.length === 0) {
                        throw new Error("장바구니 상품 정보 없음");
                    }

                    const formattedList = stateParams.cartItems.map((item: any) => ({
                        productName: item.product.productName,
                        optionName: item.product.optionContent,
                        price: item.product.price,
                        quantity: item.quantity,
                        totalPrice: item.amount
                    }));
                    
                    setOrderList(formattedList);
                }
            } catch (error) {
                console.error(error);
                alert("주문 정보를 불러오는데 실패했습니다.");
                navigate(-1);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderData();
    }, [stateParams, navigate]);

    const finalTotalPrice = orderList.reduce((acc, cur) => acc + cur.totalPrice, 0);

    const handlePayment = async () => {
        if (!recipient || !address || !phone) {
            alert("배송지 정보를 모두 입력해주세요.");
            return;
        }

        if (paymentType === "CARD" && (!cardName || !expMonth || !expYear)) {
            alert("카드 정보를 입력해주세요.");
            return;
        }

        let productReqData = null;

        if (stateParams?.orderType === "DIRECT") {
            const item = orderList[0];
            productReqData = {
                productCode: item.productCode!,
                optionCode: item.optionCode!,
                quantity: item.quantity
            };
        }

        const requestData: OrderRequest = {
            orderType: stateParams?.orderType || "DIRECT",
            
            productInfo: productReqData as any, 

            addressInfo: {
                recipient,
                address,
                addressDetail,
                phone
            },

            cardInfo: (paymentType === "CARD" ? {
                    cardBrand, cardName, cardToken, expMonth, expYear
                } : undefined) as unknown as CardInfo,

            paymentType: paymentType,
            tossKey: "", 
        };

        try {
            console.log("주문 요청 데이터:", requestData);
            await order(requestData);
            alert("주문이 완료되었습니다!");
            navigate("/my/order");
        } catch (error) {
            console.error(error);
            alert("주문 처리에 실패했습니다.");
        }
    };

    if (loading) return <div>결제 정보를 불러오는 중입니다...</div>;
    if (orderList.length === 0) return <div>주문할 상품이 없습니다.</div>;

    return (
        <div>
            <h1>주문 / 결제</h1>

            <div>
                <h3>주문 상품 목록</h3>
                {orderList.map((item, index) => (
                    <div key={index}>
                        <p>상품명: {item.productName}</p>
                        <p>옵션: {item.optionName}</p>
                        <p>수량: {item.quantity}개</p>
                        <p>금액: {item.totalPrice.toLocaleString()}원</p>
                        <hr/>
                    </div>
                ))}
                
                <div>
                    <strong>총 결제 금액: {finalTotalPrice.toLocaleString()}원</strong>
                </div>
            </div>

            <hr/>

            <h3>배송지 정보 (필수)</h3>
            <div>
                <input placeholder="받는 분" value={recipient} onChange={e => setRecipient(e.target.value)} />
                <input placeholder="전화번호" value={phone} onChange={e => setPhone(e.target.value)} />
                <input placeholder="주소" value={address} onChange={e => setAddress(e.target.value)} />
                <input placeholder="상세주소" value={addressDetail} onChange={e => setAddressDetail(e.target.value)} />
            </div>

            <hr/>

            <h3>결제 수단</h3>
            <div>
                <label>
                    <input 
                        type="radio" 
                        name="payType" 
                        checked={paymentType === "CARD"} 
                        onChange={() => setPaymentType("CARD")} 
                    /> 카드 결제
                </label>
                <label>
                    <input 
                        type="radio" 
                        name="payType" 
                        checked={paymentType === "DEPOSIT"} 
                        onChange={() => setPaymentType("DEPOSIT")} 
                    /> 예치금 결제
                </label>
            </div>

            {paymentType === "CARD" && (
                <div>
                    <h4>카드 정보 입력</h4>
                    <input placeholder="카드 소유주" value={cardName} onChange={e => setCardName(e.target.value)} />
                    <select value={cardBrand} onChange={e => setCardBrand(e.target.value)}>
                        <option value="VISA">VISA</option>
                        <option value="MASTERCARD">MasterCard</option>
                    </select>
                    <div>
                        <input placeholder="MM" value={expMonth} onChange={e => setExpMonth(e.target.value)} />
                        <input placeholder="YY" value={expYear} onChange={e => setExpYear(e.target.value)} />
                    </div>
                </div>
            )}

            {paymentType === "DEPOSIT" && (
                <div>
                    <p>보유하신 예치금에서 차감됩니다.</p>
                </div>
            )}

            <button onClick={handlePayment}>
                {finalTotalPrice.toLocaleString()}원 결제하기
            </button>
        </div>
    );
}

export default Payment;