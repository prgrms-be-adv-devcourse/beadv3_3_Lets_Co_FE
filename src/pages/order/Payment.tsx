import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import type { PaymentRequest } from "../../types/request/paymentRequest";
import type { UserInfo } from "../../types/userInfo";
import type { AddressInfo } from "../../types/addressInfo";
import type { CardInfo } from "../../types/cardInfo";
import { getProduct } from "../../api/productApi";
import { payment } from "../../api/paymentApi";
import QueueModal from "../../components/QueueModal";
import type { WaitingQueueResponse } from "../../types/response/waitingQueueResponse";
import { orderEnter, orderStatus } from "../../api/queue";

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

  // --- 대기열 관리를 위한 상태 및 Ref 추가 ---
  const [isWaiting, setIsWaiting] = useState<boolean>(true); // 진입하자마자 대기 상태로 시작
  const [queueInfo, setQueueInfo] = useState<WaitingQueueResponse | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  // 컴포넌트 언마운트 시 인터벌 정리
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // 대기열 및 상품 정보 불러오기
  useEffect(() => {
    if (!stateParams || !stateParams.orderCode) {
      alert("잘못된 접근입니다 (주문 정보 누락).");
      navigate(-1);
      return;
    }

    // 주문 대기열 입장 로직
    const startOrderQueue = async () => {
      try {
        setIsWaiting(true);
        await orderEnter(); // 주문 대기열 진입 API 호출

        intervalRef.current = setInterval(async () => {
          try {
            const status = await orderStatus(); // 상태 조회
            setQueueInfo(status);

            if (status.isAllowed) {
              if (intervalRef.current) clearInterval(intervalRef.current);
              setIsWaiting(false); // 내 차례가 오면 모달 닫기
            }
          } catch (error) {
            console.error("주문 대기열 상태 확인 중 오류:", error);
            if (intervalRef.current) clearInterval(intervalRef.current);
            setIsWaiting(false);
          }
        }, 1000);

      } catch (error) {
        console.error("주문 대기열 진입 실패:", error);
        setIsWaiting(false);
      }
    };

    // 상품 정보 불러오기 로직 (기존 로직 유지)
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

    // 컴포넌트 마운트 시 두 가지를 모두 실행
    startOrderQueue();
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
      navigate("/my/orders");
    } catch (error) {
      console.error("결제 실패:", error);
      alert("주문 처리에 실패했습니다. 다시 시도해주세요.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  if (orderList.length === 0) {
    return (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100 max-w-3xl mx-auto mt-10">
            <p className="text-gray-500">주문할 상품이 없습니다.</p>
        </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      {/* 페이지 헤더 */}
      <div className="mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-800">주문 / 결제</h1>
        <p className="text-sm text-gray-500 mt-2">주문하실 상품과 배송지를 확인해주세요.</p>
      </div>

      <div className="space-y-6">
        {/* 주문 상품 목록 카드 */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-gray-800 mb-5">주문 상품 정보</h3>
          <div className="space-y-4">
            {orderList.map((item, index) => (
              <div key={index} className="flex justify-between items-center pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div>
                  <p className="font-semibold text-gray-800 text-lg">{item.productName}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    옵션: {item.optionName} <span className="mx-2 text-gray-300">|</span> 수량: {item.quantity}개
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">{item.totalPrice.toLocaleString()}원</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-5 border-t border-gray-200 bg-gray-50 p-4 rounded-xl flex justify-between items-center">
            <span className="font-bold text-gray-600">총 결제 금액</span>
            <span className="text-2xl font-bold text-blue-600">{totalPrice.toLocaleString()}원</span>
          </div>
        </section>

        {/* 배송지 정보 카드 */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-gray-800 mb-5">배송지 정보</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">받는 분 성함</label>
              <input 
                placeholder="홍길동" 
                value={recipient} 
                onChange={e => setRecipient(e.target.value)} 
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">연락처</label>
              <input 
                placeholder="010-0000-0000" 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">주소</label>
              <input 
                placeholder="기본 주소를 입력하세요" 
                value={address} 
                onChange={e => setAddress(e.target.value)} 
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">상세 주소</label>
              <input 
                placeholder="상세 주소를 입력하세요 (동, 호수)" 
                value={addressDetail} 
                onChange={e => setAddressDetail(e.target.value)} 
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>
        </section>

        {/* 결제 수단 선택 카드 */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-gray-800 mb-5">결제 수단</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <label className={`cursor-pointer rounded-xl border p-4 flex items-center justify-center gap-2 transition-all ${
                paymentType === "CARD" ? "border-blue-500 bg-blue-50 text-blue-700 font-bold" : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}>
              <input type="radio" name="payType" className="hidden" checked={paymentType === "CARD"} onChange={() => setPaymentType("CARD")} />
              신용/체크카드
            </label>
            <label className={`cursor-pointer rounded-xl border p-4 flex items-center justify-center gap-2 transition-all ${
                paymentType === "DEPOSIT" ? "border-blue-500 bg-blue-50 text-blue-700 font-bold" : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}>
              <input type="radio" name="payType" className="hidden" checked={paymentType === "DEPOSIT"} onChange={() => setPaymentType("DEPOSIT")} />
              예치금 결제
            </label>
            <label className={`cursor-pointer rounded-xl border p-4 flex items-center justify-center gap-2 transition-all ${
                paymentType === "TOSS_PAY" ? "border-blue-500 bg-blue-50 text-blue-700 font-bold" : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}>
              <input type="radio" name="payType" className="hidden" checked={paymentType === "TOSS_PAY"} onChange={() => setPaymentType("TOSS_PAY")} />
              토스 결제
            </label>
          </div>

          {/* 결제 수단별 상세 영역 */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            {paymentType === "CARD" && (
              <div className="space-y-5">
                <h4 className="text-sm font-bold text-gray-700 border-b border-gray-200 pb-2">상세 카드 정보</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5 font-medium">카드 소유주</label>
                    <input 
                      placeholder="홍길동" 
                      value={cardName} 
                      onChange={e => setCardName(e.target.value)} 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5 font-medium">카드 브랜드</label>
                    <select 
                      value={cardBrand} 
                      onChange={e => setCardBrand(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                    >
                      <option value="VISA">VISA</option>
                      <option value="MASTERCARD">MasterCard</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 font-medium">유효 기간 (MM/YY)</label>
                  <div className="flex items-center gap-3">
                    <input 
                      placeholder="MM" 
                      maxLength={2}
                      value={expMonth} 
                      onChange={e => setExpMonth(e.target.value)} 
                      className="w-20 border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                    />
                    <span className="text-gray-400 font-light">/</span>
                    <input 
                      placeholder="YY" 
                      maxLength={2}
                      value={expYear} 
                      onChange={e => setExpYear(e.target.value)} 
                      className="w-20 border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentType === "DEPOSIT" && (
              <div className="text-center py-4">
                <div className="inline-block bg-blue-100 text-blue-600 rounded-full p-3 mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <p className="text-gray-700">보유하신 예치금에서 <strong className="text-blue-600 text-lg">{totalPrice.toLocaleString()}원</strong>이 즉시 차감됩니다.</p>
              </div>
            )}

            {paymentType === "TOSS_PAY" && (
              <div className="text-center py-4">
                <div className="inline-block bg-blue-100 text-blue-600 rounded-full p-3 mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                </div>
                <p className="text-gray-700">결제하기 버튼을 누르면 안전한 <strong>토스 페이먼츠</strong> 화면으로 이동합니다.</p>
              </div>
            )}
          </div>
        </section>

        {/* 최종 결제 버튼 */}
        <button 
          onClick={handlePayment}
          className="w-full bg-gray-800 text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-gray-900 active:bg-black transition-all shadow-md mt-6"
        >
          {totalPrice.toLocaleString()}원 결제하기
        </button>

      </div>

      <QueueModal isOpen={isWaiting} queueInfo={queueInfo} />
    </div>
  );
}

export default Payment;