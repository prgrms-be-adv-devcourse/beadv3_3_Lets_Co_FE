import { Link } from "react-router-dom";

function Seller() {
    return (
        <div className="max-w-5xl mx-auto py-10 px-4">
            {/* 페이지 타이틀 */}
            <div className="mb-8 border-b border-gray-200 pb-4">
                <h1 className="text-2xl font-bold text-gray-800">판매자 페이지</h1>
                <p className="text-sm text-gray-500 mt-2">판매자 전용 대시보드입니다. 상품 및 고객 문의를 관리할 수 있습니다.</p>
            </div>

            {/* 메뉴 그리드 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                
                <Link 
                    to="/seller/product/add" 
                    className="flex flex-col justify-center p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group"
                >
                    <span className="text-sm text-gray-400 font-medium mb-1">새로운 상품 등록하기</span>
                    <span className="font-bold text-gray-700 text-lg group-hover:text-blue-600">상품 등록</span>
                </Link>

                <Link 
                    to="/seller/product/list" 
                    className="flex flex-col justify-center p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group"
                >
                    <span className="text-sm text-gray-400 font-medium mb-1">등록된 상품 정보 및 재고 수정</span>
                    <span className="font-bold text-gray-700 text-lg group-hover:text-blue-600">제품 관리 페이지</span>
                </Link>

                <Link 
                    to="/seller/board/qna" 
                    className="flex flex-col justify-center p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group"
                >
                    <span className="text-sm text-gray-400 font-medium mb-1">고객 문의 확인 및 답변 작성</span>
                    <span className="font-bold text-gray-700 text-lg group-hover:text-blue-600">판매자 QnA 페이지</span>
                </Link>
                
            </div>
        </div>
    );
}

export default Seller;