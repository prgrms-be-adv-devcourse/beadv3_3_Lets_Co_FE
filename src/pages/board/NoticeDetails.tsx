import { useEffect, useState } from "react";
import type { noticeDetailsResponse } from "../../types/response/noticeDetailsResponse";
import { getNoticeDetails } from "../../api/noticeApi";
import { useNavigate, useParams } from "react-router-dom";

function NoticeDetails() {
    
    const { noticeCode } = useParams<{ noticeCode: string }>();

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [notice, setNotice] = useState<noticeDetailsResponse | null>(null);

    const fetchNotice = async (code: string) => { 
        try {
            setLoading(true);
            const data = await getNoticeDetails(code);
            setNotice(data);
        } catch (error) {
            console.log(error);
            navigate(-1);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (noticeCode) {
            fetchNotice(noticeCode);
        }
    }, [noticeCode]);

    if (!notice && !loading) return <div>데이터가 없습니다.</div>;

    return (
        <div>
            <h1>공지 상세</h1>

            <div>
                <label>제목</label>
                <span>{notice?.title}</span>
            </div>
            <div>
                <label>카테고리</label>
                <span>{notice?.category}</span>
            </div>
            <div>
                <label>조회수</label>
                <span>{notice?.viewCount}</span>
            </div>
            <div>
                <label>등록/수정일</label>
                <span>{notice?.updatedAt}</span>
            </div>

            <div>
                <label>내용</label>
                <div>{notice?.content}</div>
            </div>
        </div>
    );
}

export default NoticeDetails;