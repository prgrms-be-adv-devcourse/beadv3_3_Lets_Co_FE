import { useState, type FormEvent } from "react";
import type { ChargeRequest } from "../../types/request/chargeRequest";
import { charge } from "../../api/paymentApi";
import { useNavigate } from "react-router-dom";

function Charge() {
    // 오타 수정: setAmout -> setAmount
    const [amount, setAmount] = useState(0);
    const [paymentType, setPaymentType] = useState<"CARD" | "TOSS_PAY">("CARD");
    
    const [cardName, setCardName] = useState("");
    const [cardBrand, setCardBrand] = useState("VISA");
    const [expMonth, setExpMonth] = useState("");
    const [expYear, setExpYear] = useState("");
    // const [cardToken] = useState(""); 

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
        <div className="max-w-xl mx-auto py-12 px-4">
            {/* 페이지 타이틀 */}
            <div className="mb-8 border-b border-gray-200 pb-4">
                <h1 className="text-2xl font-bold text-gray-800">예치금 충전</h1>
                <p className="text-sm text-gray-500 mt-2">빠르고 안전하게 예치금을 충전하세요.</p>
            </div>

            {/* 메인 폼 카드 */}
            <form onSubmit={submitHandeler} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-8">
                
                {/* 1. 충전 금액 입력 */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">충전할 금액</label> 
                    <div className="relative">
                        <input 
                            type="number"
                            value={amount || ""}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            placeholder="0"
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg font-bold text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pr-12"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                            원
                        </span>
                    </div>
                </div>

                {/* 2. 결제 수단 선택 */}
                <div>
                    <h3 className="block text-sm font-bold text-gray-700 mb-3">결제 수단</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {/* 카드 결제 선택 버튼 */}
                        <label className={`cursor-pointer rounded-xl border p-4 flex items-center gap-3 transition-all ${
                            paymentType === "CARD" 
                                ? "border-blue-500 bg-blue-50 text-blue-700 font-bold" 
                                : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}>
                            <input 
                                type="radio" 
                                name="payType" 
                                className="hidden"
                                checked={paymentType === "CARD"} 
                                onChange={() => setPaymentType("CARD")} 
                            /> 
                            <div className={`w-4 h-4 rounded-full border flex justify-center items-center ${
                                paymentType === "CARD" ? "border-blue-500" : "border-gray-300"
                            }`}>
                                {paymentType === "CARD" && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                            </div>
                            신용/체크카드
                        </label>

                        {/* 토스 결제 (주석 처리된 기능도 디자인은 유지) */}
                        {/* <label className={`cursor-pointer rounded-xl border p-4 flex items-center gap-3 transition-all ${
                            paymentType === "TOSS_PAY" 
                                ? "border-blue-500 bg-blue-50 text-blue-700 font-bold" 
                                : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}>
                            <input 
                                type="radio" 
                                name="payType" 
                                className="hidden"
                                checked={paymentType === "TOSS_PAY"} 
                                onChange={() => setPaymentType("TOSS_PAY")} 
                            /> 
                            <div className={`w-4 h-4 rounded-full border flex justify-center items-center ${
                                paymentType === "TOSS_PAY" ? "border-blue-500" : "border-gray-300"
                            }`}>
                                {paymentType === "TOSS_PAY" && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                            </div>
                            토스페이
                        </label> 
                        */}
                    </div>
                </div>

                {/* 3. 카드 정보 입력 (카드 선택 시에만 렌더링) */}
                {paymentType === "CARD" && (
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-5">
                        <h4 className="text-sm font-bold text-gray-700 border-b border-gray-200 pb-2">상세 카드 정보</h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1.5 font-medium">카드 소유주</label>
                                <input 
                                    placeholder="홍길동" 
                                    value={cardName} 
                                    onChange={e => setCardName(e.target.value)} 
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1.5 font-medium">카드 브랜드</label>
                                <select 
                                    value={cardBrand} 
                                    onChange={e => setCardBrand(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white"
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
                                    className="w-20 border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                />
                                <span className="text-gray-400 font-light">/</span>
                                <input 
                                    placeholder="YY" 
                                    maxLength={2}
                                    value={expYear} 
                                    onChange={e => setExpYear(e.target.value)} 
                                    className="w-20 border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* {paymentType === "TOSS_PAY" && (
                <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 text-center">
                    <p className="text-sm text-blue-700">충전 버튼을 누르면 <strong>토스 페이먼츠</strong> 화면으로 안전하게 이동합니다.</p>
                </div>
                )} 
                */}

                {/* 4. 결제(Submit) 버튼 */}
                <button 
                    type="submit"
                    className="w-full bg-gray-800 text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-gray-900 active:bg-black transition-all shadow-md mt-4"
                >
                    {amount > 0 ? `${amount.toLocaleString()}원 충전하기` : "충전하기"}
                </button>
            </form>
        </div>
    );
}

export default Charge;