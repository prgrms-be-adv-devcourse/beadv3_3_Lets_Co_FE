import { loadTossPayments, type TossPaymentsWidgets } from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// 테스트용 키
const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = "quLU1MI83FWEP8cbj9WOX";

export function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Payment 페이지에서 넘겨준 데이터 받기
  const state = location.state as {
    amount: number;
    orderId: string;
    orderName: string;
    customerName: string;
  } | null;

  const [ready, setReady] = useState<boolean>(false);
  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);

  useEffect(() => {
    // 직접 URL로 접근했거나 데이터가 없으면 뒤로가기
    if (!state) {
      alert("잘못된 접근입니다.");
      navigate(-1);
      return;
    }

    async function fetchPaymentWidgets() {
      const tossPayments = await loadTossPayments(clientKey);

      // 회원 결제
      const widgetsInstance = tossPayments.widgets({
        customerKey,
      });

      setWidgets(widgetsInstance);
    }

    fetchPaymentWidgets();
  }, [state, navigate]);

  useEffect(() => {
    async function renderPaymentWidgets() {
      if (widgets == null || state == null) {
        return;
      }

      await widgets.setAmount({
        currency: "KRW",
        value: state.amount,
      });

      await Promise.all([
        widgets.renderPaymentMethods({
          selector: "#payment-method",
          variantKey: "DEFAULT",
        }),

        widgets.renderAgreement({
          selector: "#agreement",
          variantKey: "AGREEMENT",
        }),
      ]);

      setReady(true);
    }

    renderPaymentWidgets();
  }, [widgets, state]);

  // state가 없을 경우 렌더링 방지
  if (!state) return null;

  return (
    <div className="wrapper" style={{ padding: "20px" }}>
      <h2>토스 결제</h2>
      <div className="box_section">
        <div id="payment-method" />
        <div id="agreement" />

        <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
          <button onClick={() => navigate(-1)} className="button" style={{ backgroundColor: "#ccc" }}>
            취소
          </button>

          <button
            className="button"
            disabled={!ready}
            onClick={async () => {
              if (!widgets) return;

              try {
                await widgets.requestPayment({
                  orderId: state.orderId,
                  orderName: state.orderName,
                  successUrl: window.location.origin + "/toss/success",
                  failUrl: window.location.origin + "/toss/fail",
                  customerName: state.customerName,
                });
              } catch (error) {
                // 에러 처리하기
                console.error(error);
                alert("결제 요청 중 오류가 발생했습니다.");
              }
            }}
          >
            {state.amount.toLocaleString()}원 결제하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;