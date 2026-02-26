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

    if (!orderId || !amount || !paymentKey) {
      alert("결제 정보가 올바르지 않습니다.");
      navigate("/");
      return;
    }

    const storedAddress = sessionStorage.getItem("temp_order_address");
    let addressInfo: AddressInfo;

    if (storedAddress) {
      try {
        addressInfo = JSON.parse(storedAddress);
      } catch (e) {
        console.error("주소 정보 파싱 실패", e);
        addressInfo = { recipient: "", address: "", addressDetail: "", phone: "" };
      }
    } else {
      addressInfo = { recipient: "", address: "", addressDetail: "", phone: "" };
    }

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

    async function confirm() {
      try {
        console.log("토스 최종 승인 요청:", requestData);
        await payment(requestData);
        
        sessionStorage.removeItem("temp_order_address");
        
        alert("결제가 정상적으로 완료되었습니다.");
        navigate("/my/orders");
      } catch (error) {
        console.error("승인 실패:", error);
        alert("결제 승인 중 오류가 발생했습니다. 관리자에게 문의하세요.");
        navigate('/');
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