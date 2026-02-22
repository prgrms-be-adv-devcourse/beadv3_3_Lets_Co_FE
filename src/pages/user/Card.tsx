import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { addCard, deleteCard, getCard, updateCard } from "../../api/userApi"; 
import type { UpsertCardRequest } from "../../types/request/upsertCardRequest";
import type { DeleteCardRequest } from "../../types/request/deleteCardRequest";
import type { CardResponse } from "../../types/response/cardResponse";

function Card() {
    const [loading, setLoading] = useState<boolean>(true);
    const [cardList, setCardList] = useState<CardResponse[]>([]);
    const [showForm, setShowForm] = useState<boolean>(false);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editFormData, setEditFormData] = useState({
        cardBrand: "",
        cardName: "",
        cardToken: "",
        expMonth: 0,
        expYear: 0,
        defaultCard: false
    });

    const [formData, setFormData] = useState({
        cardBrand: "",
        cardName: "",
        cardToken: "",
        expMonth: 0,
        expYear: 0,
        defaultCard: false
    });

    useEffect(() => {
        fetchCardData();
    }, []);

    const fetchCardData = async () => {
        try {
            const response = await getCard();
            if (response && response.resultCode === "SUCCESS") {
                setCardList(response.data);
            } else if (Array.isArray(response)) {
                setCardList(response);
            }
        } catch (error) {
            console.error("카드 목록 조회 실패:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData({ 
            ...formData, 
            [name]: type === 'checkbox' ? checked : 
                    (name === 'expMonth' || name === 'expYear') ? Number(value) : value 
        });
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setEditFormData({ 
            ...editFormData, 
            [name]: type === 'checkbox' ? checked : 
                    (name === 'expMonth' || name === 'expYear') ? Number(value) : value 
        });
    };

    const startEditing = (card: CardResponse) => {
        setEditingId(card.cardCode);
        setEditFormData({
            cardBrand: card.cardBrand,
            cardName: card.cardName,
            cardToken: card.cardToken,
            expMonth: card.expMonth,
            expYear: card.expYear,
            defaultCard: card.defaultCard
        });
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditFormData({ cardBrand: "", cardName: "", cardToken: "", expMonth: 0, expYear: 0, defaultCard: false });
    };

    const handleUpdate = async (cardCode: string) => {
        const updateData: UpsertCardRequest = {
            cardCode: cardCode,
            defaultCard: editFormData.defaultCard,
            cardBrand: editFormData.cardBrand,
            cardName: editFormData.cardName,
            cardToken: editFormData.cardToken,
            expMonth: editFormData.expMonth,
            expYear: editFormData.expYear
        };

        try {
            await updateCard(updateData);
            alert("카드 정보가 수정되었습니다.");
            setEditingId(null);
            fetchCardData();
        } catch (error) {
            alert("수정 실패");
        }
    };

    const handleSubmit = async () => {
        const addData: UpsertCardRequest = {
            cardCode: "",
            defaultCard: formData.defaultCard,
            cardBrand: formData.cardBrand,
            cardName: formData.cardName,
            cardToken: formData.cardToken,
            expMonth: formData.expMonth,
            expYear: formData.expYear
        };

        try {
            await addCard(addData);
            alert("새 카드가 저장되었습니다.");
            setFormData({ cardBrand: "", cardName: "", cardToken: "", expMonth: 0, expYear: 0, defaultCard: false });
            setShowForm(false);
            fetchCardData();
        } catch (e) {
            alert("카드 추가 실패");
        }
    };

    const handleDeleteClick = async (code: string) => {
        if (!window.confirm("정말 이 카드를 삭제하시겠습니까?")) return;
        
        const deleteData: DeleteCardRequest = { cardCode: code };

        try {
            await deleteCard(deleteData);
            alert("삭제되었습니다.");
            fetchCardData();
        } catch (error) {
            alert("카드 삭제 실패");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-800"></div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-800">결제 수단 관리</h1>
                <Link to="/my" className="text-sm text-gray-500 hover:text-gray-800 transition-colors font-medium">
                    마이페이지로 돌아가기
                </Link>
            </div>

            <div className="space-y-4 mb-8">
                {cardList.length > 0 ? (
                    cardList.map((card) => {
                        const isEditing = editingId === card.cardCode;
                        return (
                            <div key={card.cardCode} className={`bg-white rounded-xl shadow-sm border p-6 transition-all ${card.defaultCard ? 'border-blue-200 ring-1 ring-blue-50' : 'border-gray-100'}`}>
                                {isEditing ? (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-400 mb-1">카드사</label>
                                                <input name="cardBrand" value={editFormData.cardBrand} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-400 mb-1">카드 별칭</label>
                                                <input name="cardName" value={editFormData.cardName} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-400 mb-1">카드 번호</label>
                                            <input name="cardToken" value={editFormData.cardToken} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-400 mb-1">유효기간(월)</label>
                                                <input type="number" name="expMonth" value={editFormData.expMonth} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-400 mb-1">유효기간(년)</label>
                                                <input type="number" name="expYear" value={editFormData.expYear} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2 pt-2">
                                            <input type="checkbox" name="defaultCard" id={`edit-default-${card.cardCode}`} checked={editFormData.defaultCard} onChange={handleEditChange} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                            <label htmlFor={`edit-default-${card.cardCode}`} className="text-xs font-semibold text-gray-600">기본 결제 수단으로 설정</label>
                                        </div>
                                        <div className="flex justify-end space-x-2">
                                            <button onClick={() => handleUpdate(card.cardCode)} className="px-4 py-2 bg-gray-800 text-white text-xs font-bold rounded-md hover:bg-gray-700">저장</button>
                                            <button onClick={cancelEditing} className="px-4 py-2 bg-gray-100 text-gray-600 text-xs font-bold rounded-md hover:bg-gray-200">취소</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-center">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-gray-800 text-lg">{card.cardBrand}</span>
                                                {card.defaultCard && (
                                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full border border-blue-100">DEFAULT</span>
                                                )}
                                                <span className="text-xs text-gray-400 font-medium">[{card.cardName}]</span>
                                            </div>
                                            <p className="text-sm text-gray-500 font-mono tracking-wider">{card.cardToken}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">EXP: {String(card.expMonth).padStart(2, '0')}/{card.expYear}</p>
                                        </div>
                                        <div className="flex flex-col space-y-2 text-right">
                                            <button onClick={() => startEditing(card)} className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors">정보 수정</button>
                                            <button onClick={() => handleDeleteClick(card.cardCode)} className="text-xs font-semibold text-red-400 hover:text-red-600 transition-colors">카드 삭제</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
                        <p className="text-sm text-gray-400 font-medium">등록된 카드 정보가 없습니다.</p>
                    </div>
                )}
            </div>

            <button onClick={() => setShowForm(!showForm)} className={`w-full py-4 rounded-xl font-bold border-2 transition-all ${showForm ? "bg-white border-gray-200 text-gray-500" : "bg-white border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white"}`}>
                {showForm ? "취소하기" : "+ 새 결제 카드 추가"}
            </button>

            {showForm && (
                <div className="mt-6 bg-white rounded-xl shadow-md border border-blue-100 p-8 space-y-5 animate-in fade-in duration-300">
                    <h3 className="text-lg font-bold text-gray-800 border-b border-gray-50 pb-3">새 카드 정보</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 mb-1">카드사</label>
                            <input name="cardBrand" value={formData.cardBrand} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="국민카드" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 mb-1">카드 별칭</label>
                            <input name="cardName" value={formData.cardName} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="생활비" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1">카드 번호</label>
                        <input name="cardToken" value={formData.cardToken} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono" placeholder="번호 입력" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 mb-1">유효기간(월)</label>
                            <input type="number" name="expMonth" value={formData.expMonth} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="MM" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 mb-1">유효기간(년)</label>
                            <input type="number" name="expYear" value={formData.expYear} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="YYYY" />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 pt-2">
                        <input type="checkbox" name="defaultCard" id="new-default" checked={formData.defaultCard} onChange={handleInputChange} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                        <label htmlFor="new-default" className="text-xs font-semibold text-gray-600">기본 결제 수단으로 설정</label>
                    </div>
                    <button onClick={handleSubmit} className="w-full bg-gray-800 text-white py-3.5 rounded-lg font-bold hover:bg-gray-700 transition-colors mt-2">카드 저장하기</button>
                </div>
            )}
        </div>
    );
}

export default Card;