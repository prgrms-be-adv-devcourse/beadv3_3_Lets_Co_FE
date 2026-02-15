import { useState, type FormEvent } from "react";
import type { ChargeRequest } from "../../types/request/chargeRequest";
import { charge } from "../../api/paymentApi";
import { useNavigate } from "react-router-dom";

function Charge() {

    const [amount, setAmout] = useState(0);
    const [paymentType, setPaymentType] = useState<"CARD" | "TOSS_PAY">("CARD");
    
    const [cardName, setCardName] = useState("");
    const [cardBrand, setCardBrand] = useState("VISA");
    const [expMonth, setExpMonth] = useState("");
    const [expYear, setExpYear] = useState("");
    const [cardToken] = useState(""); 

    const navigate = useNavigate();

    const submitHandeler = async (e: FormEvent) => {
        e.preventDefault();
        
        if (amount <= 0) {
            alert("충전할 금액을 올바르게 입력해주세요.");
            return;
        }

/*
        if (paymentType === "TOSS_PAY") {
            const randomOrderId = `charge_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

            navigate("/toss/checkout", {
                state: {
                    amount: amount,
                    orderId: randomOrderId, 
                    orderName: "예치금 충전",
                    customerName: "충전 사용자",
                    customerEmail: "test@example.com",
                }
            });
            return;
        }
*/

        const chargeData: ChargeRequest = {
            amount: amount,
            paymentType: paymentType
        }

        try {
            await charge(chargeData);
            alert("결제 완료");
            navigate('/my');
        } catch (error) {
            console.log(error);
            alert("결제 실패");
        }
        
    }

    return (
        <div>
            <h1>예치금 충전</h1>

            <form onSubmit={submitHandeler}>
                
                <div>
                    <label>충전할 금액</label> 
                    <input 
                        type="number"
                        value={amount}
                        onChange={(e) => setAmout(Number(e.target.value))}
                        placeholder="충전 금액"
                    />
                </div>

                <h3>카드로 충전합니다.</h3>
                <div>
                    <label>
                        <input 
                            type="radio" 
                            name="payType" 
                            checked={paymentType === "CARD"} 
                            onChange={() => setPaymentType("CARD")} 
                        /> 카드 결제
                    </label>
{/* 
                    <label>
                        <input 
                            type="radio" 
                            name="payType" 
                            checked={paymentType === "TOSS_PAY"} 
                            onChange={() => setPaymentType("TOSS_PAY")} 
                        /> 토스 결제
                    </label> 
*/}
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
{/* 
                {paymentType === "TOSS_PAY" && (
                <div>
                    <p>충전 버튼을 누르면 <strong>토스 페이먼츠</strong> 화면으로 이동합니다.</p>
                </div>
                )} 
*/}
                <button type="submit">충전</button>
            </form>
        </div>
    );
}

export default Charge;