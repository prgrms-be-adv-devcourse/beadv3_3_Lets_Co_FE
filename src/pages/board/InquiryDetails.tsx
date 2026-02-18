import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getInquiryDetails, deleteInquiry } from "../../api/inquiryApi";
import type { InquiryDetailsResponse } from "../../types/response/inquiryDetailsResponse";
import InquiryAnswer from "./InquiryAnswer";
import AddInquiryAnswer from "./AddInquiryAnswer";

function InquiryDetails() {
    const { inquiryCode } = useParams<{ inquiryCode: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<InquiryDetailsResponse | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const fetchDetails = async (code: string) => {
        try {
            setLoading(true);
            const res = await getInquiryDetails(code);
            setData(res);
        } catch (error) {
            console.error(error);
            alert("조회 실패");
            navigate(-1);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (inquiryCode) {
            fetchDetails(inquiryCode);
        }
    }, [inquiryCode]);

    const handleDelete = async () => {
        if (!inquiryCode) return;

        if (window.confirm("정말로 삭제하시겠습니까?")) {
            try {
                await deleteInquiry(inquiryCode);
                alert("삭제되었습니다.");
                navigate('/board/inquiry'); 
            } catch (error) {
                console.error(error);
                alert("삭제 실패");
            }
        }
    };

    if (loading) return <div>로딩 중...</div>;
    if (!data) return <div>데이터가 없습니다.</div>;

    const { info, details, isOwner } = data;

    // [백엔드 미구현 고려]
    // 백엔드 구현하면 아래 코드 수정
    const answerData = (data as any).answer || null; 

    return (
        <div>
            <h1>문의 상세</h1>

            <div>
                <div>
                    <label>제목: </label>
                    <strong>{info.title}</strong>
                </div>
                <div>
                    <label>카테고리: </label>
                    <span>{info.category}</span>
                </div>
                <div>
                    <label>상태: </label>
                    <span>{info.status}</span>
                </div>
                <div>
                    <label>비공개 여부: </label>
                    <span>{info.isPrivate ? "예" : "아니오"}</span>
                </div>
                <div>
                    <label>작성일: </label>
                    <span>{info.inquiryCreatedAt}</span>
                </div>

                <hr />

                <div>
                    <label>내용 목록</label>
                    {details.length === 0 ? (
                        <div>내용이 없습니다.</div>
                    ) : (
                        details.map((detail) => (
                            <div key={detail.detailCode}>
                                <p>{detail.content}</p>
                                <small>{detail.detailCreatedAt}</small>
                                <hr />
                            </div>
                        ))
                    )}
                </div>
            </div>

            <hr />

            {!isEditing ? (
                <InquiryAnswer 
                    answer={answerData} 
                    onEdit={() => setIsEditing(true)} 
                />
            ) : (
                inquiryCode && (
                    <AddInquiryAnswer 
                        inquiryCode={inquiryCode}
                        setIsEditing={(editState) => {
                            setIsEditing(editState);
                            if (!editState) fetchDetails(inquiryCode);
                        }} 
                    />
                )
            )}

            <hr />

            <div>
                {isOwner && (
                    <button onClick={handleDelete}>삭제</button>
                )}
                <button onClick={() => navigate('/board/inquiry')}>목록</button>
            </div>
        </div>
    );
}

export default InquiryDetails;