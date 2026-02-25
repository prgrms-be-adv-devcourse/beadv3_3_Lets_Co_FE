import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getInquiryDetails, deleteInquiry } from "../../api/inquiryApi";
import type { InquiryDetailsResponse } from "../../types/response/inquiryDetailsResponse";
import InquiryAnswer from "../admin/InquiryAnswer";
import AddInquiryAnswer from "./AddInquiryAnswer";
import { useAuth } from "../../context/AuthContext"; 

function InquiryDetails() {
    const { inquiryCode } = useParams<{ inquiryCode: string }>();
    const navigate = useNavigate();
    const { userRole } = useAuth();

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

    if (loading) return (
        <div className="flex justify-center items-center h-64 text-gray-500 font-medium">
            데이터를 불러오는 중입니다...
        </div>
    );
    
    if (!data) return (
        <div className="flex justify-center items-center h-64 text-gray-500 font-medium">
            데이터가 없습니다.
        </div>
    );

    const { info, details, isOwner } = data;
    const answerData = (data as any).answer || null; 

    return (
        <div className="max-w-4xl mx-auto">
            {/* 상단 타이틀 */}
            <div className="mb-6 pb-4 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800">문의 상세</h1>
                <p className="text-sm text-gray-500 mt-2">작성하신 문의 내용과 답변을 확인할 수 있습니다.</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
                
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{info.title}</h2>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">
                            {info.category}
                        </span>
                        <span className={`px-3 py-1 rounded-full font-medium ${info.status === '답변완료' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                            {info.status}
                        </span>
                        <div className="flex items-center gap-2 border-l border-gray-300 pl-4">
                            <span className="font-semibold text-gray-400">비공개</span>
                            <span className={info.isPrivate ? "text-red-500" : ""}>{info.isPrivate ? "🔒 예" : "아니오"}</span>
                        </div>
                        <div className="flex items-center gap-2 border-l border-gray-300 pl-4">
                            <span className="font-semibold text-gray-400">작성일</span>
                            <span>{info.inquiryCreatedAt}</span>
                        </div>
                    </div>
                </div>

                <hr className="border-gray-200 mb-8" />

                {/* 문의 본문 내용 */}
                <div className="min-h-[150px] flex flex-col gap-6 text-gray-800 leading-relaxed whitespace-pre-wrap text-base">
                    {details.length === 0 ? (
                        <div className="text-gray-500 text-center py-10">내용이 없습니다.</div>
                    ) : (
                        details.map((detail, index) => (
                            <div key={detail.detailCode} className="flex flex-col gap-2">
                                <p className="text-gray-800">{detail.content}</p>
                                <span className="text-xs text-gray-400">{detail.detailCreatedAt}</span>
                                {index !== details.length - 1 && <hr className="border-gray-100 my-4" />}
                            </div>
                        ))
                    )}
                </div>

                <hr className="border-gray-200 my-8" />

                {/* 3. 답변 영역 */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                    {!isEditing ? (
                        <InquiryAnswer 
                            answer={answerData} 
                            onEdit={userRole === "ADMIN" ? () => setIsEditing(true) : undefined} 
                        />
                    ) : (
                        /* 관리자 답변 작성 및 수정 폼 */
                        userRole === "ADMIN" && inquiryCode && (
                            <AddInquiryAnswer 
                                inquiryCode={inquiryCode}
                                setIsEditing={(editState) => {
                                    setIsEditing(editState);
                                    if (!editState) fetchDetails(inquiryCode);
                                }} 
                            />
                        )
                    )}
                </div>

                {/* 하단 버튼 영역 */}
                <div className="flex justify-between items-center pt-6 mt-8 border-t border-gray-100">
                    <button 
                        onClick={() => navigate('/board/inquiry')}
                        className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium bg-white hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        목록으로
                    </button>

                    {/* 작성자 본인일 경우에만 삭제 버튼 표시 */}
                    {isOwner && (
                        <button 
                            onClick={handleDelete}
                            className="px-5 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors shadow-sm"
                        >
                            삭제
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default InquiryDetails;