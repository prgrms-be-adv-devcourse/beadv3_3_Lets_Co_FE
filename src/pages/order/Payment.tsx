import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type { PaymentRequest } from "../../types/request/paymentRequest";
import type { UserInfo } from "../../types/userInfo";
import type { AddressInfo } from "../../types/addressInfo";
import type { CardInfo } from "../../types/cardInfo";
import { getProduct } from "../../api/productApi";
import { payment } from "../../api/paymentApi";

// UI 표시용 타입
interface OrderItemView {
  productName: string;
  optionName: string;
  price: number;
  quantity: number;
  totalPrice: number;
  productCode?: string;
  optionCode?: string;
}

// location.state 타입 정의
interface PaymentStateParams {
  orderType: "DIRECT" | "CART";
  orderCode: string;
  // DIRECT
  productCode?: string;
  optionCode?: string;
  quantity?: number;
  // CART
  cartItems?: any[];
}

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  // state 타입 단언을 안전하게 처리
  const stateParams = location.state as PaymentStateParams | null;

  // 화면 상태
  const [orderList, setOrderList] = useState<OrderItemView[]>([]);
  const [loading, setLoading] = useState(true);

  // 배송지 정보
  const [recipient, setRecipient] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [phone, setPhone] = useState("");

  // 결제 수단 및 카드 정보
  const [paymentType, setPaymentType] = useState<"CARD" | "DEPOSIT" | "TOSS_PAY">("CARD");
  const [cardName, setCardName] = useState("");
  const [cardBrand, setCardBrand] = useState("VISA");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cardToken] = useState("");

  useEffect(() => {
    if (!stateParams || !stateParams.orderCode) {
      alert("잘못된 접근입니다 (주문 정보 누락).");
      navigate(-1);
      return;
    }

    const fetchOrderData = async () => {
      try {
        if (stateParams.orderType === "DIRECT") {
          // 바로 구매 로직
          if (!stateParams.productCode || !stateParams.optionCode) throw new Error("상품 정보 누락");

          const data = await getProduct(stateParams.productCode);
          const selectedOption = data.options.find((opt: any) => opt.code === stateParams.optionCode);

          if (!selectedOption) throw new Error("유효하지 않은 옵션");

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

        } else if (stateParams.orderType === "CART") {
          // 장바구니 구매 로직
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

  const totalPrice = orderList.reduce((acc, cur) => acc + cur.totalPrice, 0);

  const handlePayment = async () => {
    if (!stateParams?.orderCode) {
      alert("주문 번호가 유효하지 않습니다.");
      return;
    }

    // 배송지 정보
    if (!recipient || !address || !phone) {
      alert("배송지 정보를 모두 입력해주세요.");
      return;
    }

    // 카드 결제 유효성 검사
    if (paymentType === "CARD") {
      if (!cardName || !expMonth || !expYear) {
        alert("카드 정보를 입력해주세요.");
        return;
      }
    }

    // 토스 페이먼츠 (백엔드 API 호출 안 함, 페이지 이동)
    if (paymentType === "TOSS_PAY") {
      const orderName = orderList.length > 1
        ? `${orderList[0].productName} 외 ${orderList.length - 1}건`
        : orderList[0].productName;

      // 주소 정보를 세션 스토리지에 임시 저장 (리다이렉트 후 복구용)
      const tempAddressInfo: AddressInfo = {
        recipient,
        address,
        addressDetail,
        phone
      };
      sessionStorage.setItem("temp_order_address", JSON.stringify(tempAddressInfo));

      // 토스 결제 위젯 페이지로 이동
      navigate("/toss/checkout", {
        state: {
          amount: totalPrice,
          orderId: stateParams.orderCode,
          orderName: orderName,
          customerName: recipient
        }
      });

      return; 
    }

    // 일반 결제(CARD, DEPOSIT) (백엔드 API 호출)    
    const addressInfo: AddressInfo = {
      recipient,
      address,
      addressDetail,
      phone
    };

    let cardInfo: CardInfo | null = null;
    if (paymentType === "CARD") {
      cardInfo = {
        cardBrand,
        cardName,
        cardToken,
        expMonth: Number(expMonth),
        expYear: Number(expYear)
      };
    }

    const userInfo: UserInfo = {
      addressInfo,
      cardInfo
    };

    const paymentData: PaymentRequest = {
      orderCode: stateParams.orderCode,
      userInfo: userInfo,
      paymentType: paymentType,
      amount: totalPrice,
      tossKey: null // 일반 결제는 tossKey 없음
    };

    try {
      console.log("일반 결제 요청 데이터:", paymentData);
      await payment(paymentData);

      alert("주문이 완료되었습니다!");
      navigate("/my/order");
    } catch (error) {
      console.error("결제 실패:", error);
      alert("주문 처리에 실패했습니다. 다시 시도해주세요.");
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
            <p><strong>{item.productName}</strong></p>
            <p>옵션: {item.optionName} / 수량: {item.quantity}개</p>
            <p>금액: {item.totalPrice.toLocaleString()}원</p>
          </div>
        ))}
        <div>
          <strong>총 결제 금액: {totalPrice.toLocaleString()}원</strong>
        </div>
      </div>

      <hr />

      <h3>배송지 정보</h3>
      <div>
        <input placeholder="받는 분 성함" value={recipient} onChange={e => setRecipient(e.target.value)} />
        <input placeholder="전화번호 (010-0000-0000)" value={phone} onChange={e => setPhone(e.target.value)} />
        <input placeholder="주소" value={address} onChange={e => setAddress(e.target.value)} />
        <input placeholder="상세주소" value={addressDetail} onChange={e => setAddressDetail(e.target.value)} />
      </div>

      <hr />

      <h3>결제 수단</h3>
      <div>
        <label>
          <input type="radio" name="payType" checked={paymentType === "CARD"} onChange={() => setPaymentType("CARD")} />
          카드 결제
        </label>
        <label>
          <input type="radio" name="payType" checked={paymentType === "DEPOSIT"} onChange={() => setPaymentType("DEPOSIT")} />
          예치금 결제
        </label>
        <label>
          <input type="radio" name="payType" checked={paymentType === "TOSS_PAY"} onChange={() => setPaymentType("TOSS_PAY")} />
          토스 결제
        </label>
      </div>

      <div>
        {paymentType === "CARD" && (
          <div>
            <h4>카드 정보 입력</h4>
            <input placeholder="카드 소유주" value={cardName} onChange={e => setCardName(e.target.value)} />
            <select value={cardBrand} onChange={e => setCardBrand(e.target.value)}>
              <option value="VISA">VISA</option>
              <option value="MASTERCARD">MasterCard</option>
            </select>
            <div>
              <input placeholder="MM" value={expMonth} onChange={e => setExpMonth(e.target.value)} maxLength={2} />
              <input placeholder="YYYY" value={expYear} onChange={e => setExpYear(e.target.value)} maxLength={4} />
            </div>
          </div>
        )}

        {paymentType === "DEPOSIT" && (
          <div>
            <p>보유하신 예치금에서 <strong>{totalPrice.toLocaleString()}원</strong>이 즉시 차감됩니다.</p>
          </div>
        )}

        {paymentType === "TOSS_PAY" && (
          <div>
            <p>결제하기 버튼을 누르면 <strong>토스 페이먼츠</strong> 화면으로 이동합니다.</p>
          </div>
        )}
      </div>

      <button onClick={handlePayment}>
        {totalPrice.toLocaleString()}원 결제하기
      </button>
    </div>
  );
}

export default Payment;