import { useEffect, useState } from "react";
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
        expYear: 0
    });

    const [formData, setFormData] = useState({
        cardBrand: "",
        cardName: "",
        cardToken: "",
        expMonth: 0,
        expYear: 0
    });

    useEffect(() => {
        fetchCardData();
    }, [])

    const fetchCardData = async () => {
        try {
            const data = await getCard();
            setCardList(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    // [핸들러] 신규 추가 입력
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ 
            ...formData, 
            [name]: (name === 'expMonth' || name === 'expYear') ? Number(value) : value 
        });
    };

    // [핸들러] 수정 모드 입력
    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditFormData({ 
            ...editFormData, 
            [name]: (name === 'expMonth' || name === 'expYear') ? Number(value) : value 
        });
    };

    // [기능] 수정 모드 진입
    const startEditing = (card: CardResponse) => {
        setEditingId(card.cardCode);
        setEditFormData({
            cardBrand: card.cardBrand,
            cardName: card.cardName,
            cardToken: card.cardToken,
            expMonth: card.expMonth,
            expYear: card.expYear
        });
    };

    // [기능] 수정 취소
    const cancelEditing = () => {
        setEditingId(null);
        setEditFormData({ cardBrand: "", cardName: "", cardToken: "", expMonth: 0, expYear: 0 });
    };

    // [기능] 수정
    const handleUpdate = async (cardCode: string) => {
        const updateData: UpsertCardRequest = {
            cardCode: cardCode,
            defaultCard: false,
            cardBrand: editFormData.cardBrand,
            cardName: editFormData.cardName,
            cardToken: editFormData.cardToken,
            expMonth: editFormData.expMonth,
            expYear: editFormData.expYear
        };

        try {
            await updateCard(updateData);
            alert("수정되었습니다.");
            setEditingId(null);
            fetchCardData();
        } catch (error) {
            alert("수정 실패");
        }
    };

    // [기능] 신규 저장 (Add API)
    const handleSubmit = async () => {
        const addData: UpsertCardRequest = {
            cardCode: "",
            defaultCard: false,
            cardBrand: formData.cardBrand,
            cardName: formData.cardName,
            cardToken: formData.cardToken,
            expMonth: formData.expMonth,
            expYear: formData.expYear
        }

        try {
            await addCard(addData);
            alert("카드가 저장되었습니다.");
            setFormData({ cardBrand: "", cardName: "", cardToken: "", expMonth: 0, expYear: 0 });
            setShowForm(false);
            fetchCardData();
        } catch (e) {
            alert("카드 추가 실패");
        }
    };

    // [기능] 삭제
    const handleDelete = async (code: string) => {
        if (!window.confirm("정말 이 카드를 삭제하시겠습니까?")) return;
        
        const deleteData: DeleteCardRequest = {
            cardCode: code
        };

        try {
            await deleteCard(deleteData);
            alert("삭제되었습니다.")
            fetchCardData();
        } catch (error) {
            alert("카드 삭제 실패");
        }
    }

    if (loading) return <div>로딩 중입니다...</div>;

    return (
        <div>
            <h1>카드 목록</h1>

            {cardList.length > 0 ? (
                <div>
                    {cardList.map((card) => {
                        const isEditing = editingId === card.cardCode;

                        return (
                            <div key={card.cardCode}>
                                {isEditing ? (
                                    /* 수정 모드 */
                                    <div>
                                        <div>
                                            <label>카드사: </label>
                                            <input name="cardBrand" value={editFormData.cardBrand} onChange={handleEditChange} />
                                        </div>
                                        <div>
                                            <label>카드 별칭: </label>
                                            <input name="cardName" value={editFormData.cardName} onChange={handleEditChange} />
                                        </div>
                                        <div>
                                            <label>카드 번호: </label>
                                            <input name="cardToken" value={editFormData.cardToken} onChange={handleEditChange} />
                                        </div>
                                        <div>
                                            <label>유효기간(월): </label>
                                            <input type="number" name="expMonth" value={editFormData.expMonth} onChange={handleEditChange} />
                                        </div>
                                        <div>
                                            <label>유효기간(년): </label>
                                            <input type="number" name="expYear" value={editFormData.expYear} onChange={handleEditChange} />
                                        </div>
                                        
                                        <div>
                                            <button onClick={() => handleUpdate(card.cardCode)}>완료</button>
                                            <button onClick={cancelEditing}>취소</button>
                                        </div>
                                    </div>
                                ) : (
                                    /* 보기 모드 */
                                    <div>
                                        <div>
                                            <label>카드사: </label>
                                            <span>{card.cardBrand}</span>
                                        </div>
                                        <div>
                                            <label>카드 별칭: </label>
                                            <span>{card.cardName}</span>
                                        </div>
                                        <div>
                                            <label>카드 번호: </label>
                                            <span>{card.cardToken}</span>
                                        </div>
                                        <div>
                                            <label>유효기간: </label>
                                            <span>{card.expMonth} / {card.expYear}</span>
                                        </div>
                                        
                                        <div>
                                            <button onClick={() => startEditing(card)}>수정</button>
                                            <button onClick={() => handleDelete(card.cardCode)}>삭제</button>
                                        </div>
                                    </div>
                                )}
                                <hr />
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div>등록된 카드 정보가 없습니다.</div>
            )}

            <button onClick={() => setShowForm(!showForm)}>
                {showForm ? "취소" : "새 카드 추가하기"}
            </button>

            {showForm && (
                <div>
                    <h3>새 카드 입력</h3>
                    <div>
                        <label>카드사: </label>
                        <input name="cardBrand" value={formData.cardBrand} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>카드 이름: </label>
                        <input name="cardName" value={formData.cardName} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>카드 번호: </label>
                        <input name="cardToken" value={formData.cardToken} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>유효기간(월): </label>
                        <input type="number" name="expMonth" value={formData.expMonth} onChange={handleInputChange} placeholder="MM" />
                    </div>
                    <div>
                        <label>유효기간(년): </label>
                        <input type="number" name="expYear" value={formData.expYear} onChange={handleInputChange} placeholder="YYYY" />
                    </div>
                    <button onClick={handleSubmit}>저장하기</button>
                </div>
            )}
        </div>
    );
}

export default Card;