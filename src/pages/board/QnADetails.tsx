import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { QnADetailsResponse } from "../../types/response/QnADetailsResponse";
import type { UpsertQnaRequest } from "../../types/response/upsertQnaRequest"; 
import { getQnADetails, updateQnA, deleteQnA } from "../../api/qnaApi";
import { BOARD_CATEGORY_OPTIONS } from "../../types/boardCategory";


function QnADetails() {
    const { qnaCode } = useParams<{ qnaCode: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [qna, setQnA] = useState<QnADetailsResponse | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    
    const [editForm, setEditForm] = useState<UpsertQnaRequest>({
        category: "PRODUCT",
        title: "",
        content: "",
        name: "",
        isPrivate: false,
        detailCode: "", 
        parentCode: ""
    });

    // 데이터 조회
    const fetchQnA = async () => {
        if (!qnaCode) return;

        try {
            setLoading(true);
            const data = await getQnADetails(qnaCode);
            setQnA(data);
        } catch (error) {
            console.error("상세 조회 실패", error);
            alert("데이터를 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQnA();
    }, [qnaCode]);

    // 삭제 핸들러
    const handleDelete = async () => {
        if (!qnaCode) return;
        if (!window.confirm("정말로 삭제하시겠습니까?")) return;

        try {
            await deleteQnA(qnaCode);
            alert("삭제되었습니다.");
            navigate(-1);
        } catch (error) {
            console.error("삭제 실패", error);
            alert("삭제에 실패했습니다.");
        }
    };

    // 수정 모드 진입 핸들러
    const handleEditClick = () => {
        if (!qna) return;
        
        setEditForm({
            category: qna.questionDTO.category,
            title: qna.questionDTO.title,
            name: qna.questionDTO.userName,
            isPrivate: qna.questionDTO.isPrivate,
            content: "", 
            detailCode: "", 
            parentCode: ""
        });
        setIsEditing(true);
    };

    // 입력 핸들러 (수정 폼)
    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        
        if (e.target.type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setEditForm(prev => ({ ...prev, [name]: checked }));
        } else {
            setEditForm(prev => ({ ...prev, [name]: value }));
        }
    };

    // 수정 제출 핸들러
    const handleUpdate = async (e: FormEvent) => {
        e.preventDefault();
        if (!qnaCode) return;

        try {
            await updateQnA(qnaCode, editForm);
            alert("수정되었습니다.");
            setIsEditing(false);
            fetchQnA(); 
        } catch (error) {
            console.error("수정 실패", error);
            alert("수정 처리에 실패했습니다.");
        }
    };

    if (loading) return <div>로딩 중...</div>;
    if (!qna) return <div>데이터가 없습니다.</div>;

    return (
        <div>
            <h1>QnA 상세</h1>

            {/*수정 모드*/}
            {isEditing ? (
                <form onSubmit={handleUpdate}>
                    <div>
                        <label>카테고리: </label>
                        <select name="category" value={editForm.category} onChange={handleChange}>
                            {BOARD_CATEGORY_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>제목: </label>
                        <input 
                            type="text" 
                            name="title" 
                            value={editForm.title} 
                            onChange={handleChange} 
                        />
                    </div>
                    <div>
                        <label>작성자: </label>
                        <input 
                            type="text" 
                            name="name" 
                            value={editForm.name} 
                            onChange={handleChange} 
                        />
                    </div>
                    <div>
                        <label>비밀글: </label>
                        <input 
                            type="checkbox" 
                            name="isPrivate" 
                            checked={editForm.isPrivate} 
                            onChange={handleChange} 
                        />
                    </div>
                    <div>
                        <label>내용 수정: </label>
                        <textarea 
                            name="content" 
                            value={editForm.content} 
                            onChange={handleChange} 
                            rows={5}
                            placeholder="수정할 내용을 입력하세요"
                        />
                    </div>
                    <button type="submit">저장</button>
                    <button type="button" onClick={() => setIsEditing(false)}>취소</button>
                </form>
            ) : (
                /*조회 모드 */
                <div>
                    <div>
                        <button onClick={() => navigate(-1)}>목록으로</button>
                        <button onClick={handleEditClick}>수정</button>
                        <button onClick={handleDelete}>삭제</button>
                    </div>
                    <hr />
                    <h2>[{qna.questionDTO.category}] {qna.questionDTO.title}</h2>
                    <div>
                        <span>작성자: {qna.questionDTO.userName}</span> | 
                        <span> 조회수: {qna.questionDTO.viewCount}</span> | 
                        <span> 날짜: {qna.questionDTO.createdAt}</span> |
                        <span> {qna.questionDTO.isPrivate ? "비밀글" : "공개글"}</span>
                    </div>
                    <hr />
                    
                    <h3>내용 및 답변</h3>
                    {qna.answerDTOs && qna.answerDTOs.length > 0 ? (
                        <ul>
                            {qna.answerDTOs.map((answer) => (
                                <li key={answer.detailCode}>
                                    <div>
                                        <strong>{answer.userName}</strong> ({answer.detailCreatedAt})
                                    </div>
                                    <p>{answer.content}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>등록된 내용이 없습니다.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default QnADetails;