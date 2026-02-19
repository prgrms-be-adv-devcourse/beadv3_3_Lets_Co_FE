import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { addQnA, getQnAList } from "../../api/qnaApi";
import type { UpsertQnaRequest } from "../../types/response/upsertQnaRequest";
import { BOARD_CATEGORY_LABELS, BOARD_CATEGORY_OPTIONS } from "../../types/boardCategory";
import { BOARD_STATUS_LABELS } from "../../types/boardStatus";
import { Link } from "react-router-dom";
import type { QnAResponse } from "../../types/response/qnaResponse";

interface QnAProps {
    productcode: string;
}

function QnA({ productcode }: QnAProps) {
    const [loading, setLoading] = useState(false);
    const [qnas, setQnA] = useState<QnAResponse[]>([]);
    const [page, setPage] = useState(0);
    const [isWriting, setIsWriting] = useState(false);

    const SIZE = 5;

    const [formData, setFormData] = useState<UpsertQnaRequest>({
        category: "PRODUCT",
        title: "",
        content: "",
        name: "",
        isPrivate: false,
        detailCode: "",
        parentCode: "" 
    });

    const fetchQnA = async (page: number) => {
        try {
            setLoading(true);
            const data = await getQnAList(productcode, page, SIZE);
            setQnA(data.items || []); 
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQnA(page);
    }, [page, productcode]);

    // 입력 핸들러
    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        
        if (e.target.type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // 제출 핸들러
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.content || !formData.name) {
            alert("제목, 작성자, 내용을 모두 입력해주세요.");
            return;
        }

        try {
            await addQnA(productcode, formData);
            
            alert("문의가 등록되었습니다.");

            // 폼 초기화
            setFormData({
                category: "PRODUCT",
                title: "",
                content: "",
                name: "",
                isPrivate: false,
                detailCode: "",
                parentCode: ""
            });
            setIsWriting(false);
            setPage(0);
            fetchQnA(0);
        } catch (error) {
            console.error("등록 실패", error);
            alert("문의 등록에 실패했습니다.");
        }
    };

    return (
        <div>
            <div>
                <h1>QnA</h1>
                <button onClick={() => setIsWriting(!isWriting)}>
                    {isWriting ? "작성 취소" : "문의 작성"}
                </button>
            </div>

            {isWriting && (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>카테고리: </label>
                        <select 
                            name="category" 
                            value={formData.category} 
                            onChange={handleChange}
                        >
                            {BOARD_CATEGORY_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>작성자: </label>
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                        />
                    </div>
                    <div>
                        <label>제목: </label>
                        <input 
                            type="text" 
                            name="title" 
                            value={formData.title} 
                            onChange={handleChange} 
                        />
                    </div>
                    <div>
                        <label>비밀글: </label>
                        <input 
                            type="checkbox" 
                            name="isPrivate" 
                            checked={formData.isPrivate} 
                            onChange={handleChange} 
                        />
                    </div>
                    <div>
                        <textarea 
                            name="content" 
                            value={formData.content} 
                            onChange={handleChange} 
                            placeholder="내용을 입력하세요"
                            rows={4}
                        />
                    </div>
                    <div>
                        <button type="submit">등록하기</button>
                    </div>
                </form>
            )}

            {loading && <p>로딩 중...</p>}

            <table border={1}>
                <thead>
                    <tr>
                        <th>카테고리</th>
                        <th>상태</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>조회수</th>
                        <th>생성일</th>
                    </tr>
                </thead>
                <tbody>
                    {qnas.length === 0 ? (
                        <tr>
                            <td colSpan={6}>
                                작성된 QnA가 없습니다.
                            </td>
                        </tr>
                    ) : (
                        qnas.map((qna) => (
                            <tr key={qna.code}>
                                <td>{BOARD_CATEGORY_LABELS[qna.category] || qna.category}</td>
                                <td>{BOARD_STATUS_LABELS[qna.status] || qna.status}</td>
                                <td>
                                    <Link to={`/products/${productcode}/qna/${qna.code}`}>
                                        {qna.title}
                                    </Link>
                                </td>
                                <td>{qna.userName}</td>
                                <td>{qna.viewCount}</td>
                                <td>{qna.createdAt}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <div>
                <button onClick={() => setPage((prev) => Math.max(0, prev - 1))} disabled={page === 0}>
                    이전
                </button>
                <span>Page {page + 1}</span>
                <button onClick={() => setPage((prev) => prev + 1)}>
                    다음
                </button>
            </div>
        </div>
    );
}

export default QnA;
