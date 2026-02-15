import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { payment } from "../../api/paymentApi"; 
import type { PaymentRequest } from "../../types/request/paymentRequest";
import type { AddressInfo } from "../../types/addressInfo";

export function SuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isConfirming, setIsConfirming] = useState(true);

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");
    const paymentKey = searchParams.get("paymentKey");

    // 파라미터가 없으면 비정상 접근 처리
    if (!orderId || !amount || !paymentKey) {
      alert("결제 정보가 올바르지 않습니다.");
      navigate("/");
      return;
    }

    // sessionStorage에서 저장해둔 주소 정보 복구
    const storedAddress = sessionStorage.getItem("temp_order_address");
    let addressInfo: AddressInfo;

    if (storedAddress) {
      try {
        addressInfo = JSON.parse(storedAddress);
      } catch (e) {
        // 파싱 에러 시 기본값 (혹은 에러 처리)
        console.error("주소 정보 파싱 실패", e);
        addressInfo = { recipient: "", address: "", addressDetail: "", phone: "" };
      }
    } else {
      // 주소 정보가 유실된 경우 (직접 URL 접근 등)
      // 백엔드 필수값 정책에 따라 빈 값 처리하거나 에러 처리
      addressInfo = { recipient: "", address: "", addressDetail: "", phone: "" };
    }

    // 백엔드로 보낼 데이터 구성
    const requestData: PaymentRequest = {
      orderCode: orderId,
      paymentType: "TOSS_PAY",
      amount: Number(amount),
      tossKey: paymentKey,
      
      userInfo: { 
        addressInfo: addressInfo,
        cardInfo: null
      }
    };

    // 최종 승인 API 호출 함수
    async function confirm() {
      try {
        console.log("토스 최종 승인 요청:", requestData);
        await payment(requestData);
        
        // 성공 시: 사용한 임시 데이터 삭제 후 이동
        sessionStorage.removeItem("temp_order_address");
        
        alert("결제가 정상적으로 완료되었습니다.");
        navigate("/my/order"); // 주문 내역으로 이동
      } catch (error) {
        console.error("승인 실패:", error);
        alert("결제 승인 중 오류가 발생했습니다. 관리자에게 문의하세요.");
        navigate("/cart"); // 실패 시 장바구니 등으로 이동
      } finally {
        setIsConfirming(false);
      }
    }

    confirm();
  }, [searchParams, navigate]);

  return (
    <div className="result wrapper">
      <div className="box_section">
        {isConfirming ? (
          <div>
             <h2>결제 승인 요청 중입니다...</h2>
             <p>잠시만 기다려주세요.</p>
          </div>
        ) : (
          <div>
            <h2>처리 완료</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default SuccessPage;