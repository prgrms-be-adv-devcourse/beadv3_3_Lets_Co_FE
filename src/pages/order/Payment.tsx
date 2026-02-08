import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type { CardInfo } from "../../types/cardInfo";
import type { OrderRequest } from "../../types/request/OrderRequest";
import type { ProductDetailResponse } from "../../types/response/productDetailResponse";
import { order } from "../../api/orderApi";
import { getProduct } from "../../api/productApi";

export default function Payment() {
    const location = useLocation();
    const navigate = useNavigate();
    
    const stateParams = location.state as { 
        productCode: string; 
        optionCode: string; 
        quantity: number; 
        orderType: string; 
    } | null;

    // API로 불러온 최신 상품 정보
    const [productInfo, setProductInfo] = useState<ProductDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);

    // 사용자 입력 정보
    const [recipient, setRecipient] = useState("");
    const [address, setAddress] = useState("");
    const [addressDetail, setAddressDetail] = useState("");
    const [phone, setPhone] = useState("");

    // 결제 타입
    const [paymentType, setPaymentType] = useState<"CARD" | "DEPOSIT">("CARD");

    // 카드 정보
    const [cardName, setCardName] = useState("");
    const [cardBrand, setCardBrand] = useState("VISA");
    const [expMonth, setExpMonth] = useState("");
    const [expYear, setExpYear] = useState("");
    const [cardToken, setCardToken] = useState(""); 


    useEffect(() => {
        if (!stateParams || !stateParams.productCode || !stateParams.optionCode) {
            alert("잘못된 접근입니다.");
            navigate(-1); // 뒤로가기
            return;
        }

        const fetchProductForPayment = async () => {
            try {
                const data = await getProduct(stateParams.productCode);
                setProductInfo(data);
            } catch (error) {
                console.error("결제 정보를 불러오는데 실패했습니다.", error);
                alert("상품 정보를 불러올 수 없습니다. 다시 시도해주세요.");
                navigate(-1);
            } finally {
                setLoading(false);
            }
        };

        fetchProductForPayment();
    }, [stateParams, navigate]);

    if (loading) return <div>결제 정보를 불러오는 중입니다...</div>;
    if (!productInfo || !stateParams) return <div>상품 정보가 없습니다.</div>;

    const selectedOption = productInfo.options.find(opt => opt.code === stateParams.optionCode);

    if (!selectedOption) {
        return (
            <div>
                <p>선택하신 옵션을 찾을 수 없습니다. (품절 또는 변경됨)</p>
                <button onClick={() => navigate(-1)}>돌아가기</button>
            </div>
        );
    }

    const realPrice = selectedOption.salePrice > 0 ? selectedOption.salePrice : selectedOption.price;
    const totalPrice = realPrice * stateParams.quantity;

    const handlePayment = async () => {
        if (!recipient || !address || !phone) {
            alert("배송지 정보를 모두 입력해주세요.");
            return;
        }

        if (paymentType === "CARD" && (!cardName || !expMonth || !expYear)) {
            alert("카드 정보를 입력해주세요.");
            return;
        }

        const requestData: OrderRequest = {
            orderType: stateParams.orderType,

            productInfo: {
                productCode: productInfo.productsCode,
                optionCode: selectedOption.code,
                quantity: stateParams.quantity
            },

            addressInfo: {
                recipient,
                address,
                addressDetail,
                phone
            },

            cardInfo: (paymentType === "CARD" ? {
                    cardBrand,
                    cardName,
                    cardToken,
                    expMonth,
                    expYear
                } : undefined) as unknown as CardInfo,

            paymentType: paymentType,
            tossKey: "", 
        };

        try {
            console.log("주문 요청 데이터:", requestData);
            await order(requestData);
            alert("주문이 완료되었습니다!");
            navigate("/order-complete");
        } catch (error) {
            console.error(error);
            alert("주문 처리에 실패했습니다.");
        }
    };

    return (
        <div>
            <h1>주문 / 결제</h1>

            <div>
                <h3>주문 상품 정보</h3>
                <p>상품명: {productInfo.name}</p>
                <p>옵션: {selectedOption.name}</p>
                <p>가격: {realPrice.toLocaleString()}원</p>
                <p>수량: {stateParams.quantity}개</p>
                <p>총 결제 금액: {totalPrice.toLocaleString()}원</p>
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
                        <option value="SHINHAN">신한카드</option>
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
                {totalPrice.toLocaleString()}원 결제하기
            </button>
        </div>
    );
}