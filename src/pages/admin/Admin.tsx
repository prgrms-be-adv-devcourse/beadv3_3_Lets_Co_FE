import { Link } from "react-router-dom";

function Admin() {
    return (
        <div className="max-w-5xl mx-auto">
            {/* 페이지 타이틀 */}
            <div className="mb-8 border-b border-gray-200 pb-4">
                <h1 className="text-2xl font-bold text-gray-800">관리자 페이지</h1>
                <p className="text-sm text-gray-500 mt-2">관리자 전용 메뉴입니다. 원하시는 작업을 선택해주세요.</p>
            </div>

            {/* 메뉴 그리드 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                
                
                <Link 
                    to={'/admin/catetory'} 
                    className="flex items-center justify-center h-24 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:bg-gray-50 transition-all text-gray-700 font-medium text-lg"
                >
                    카테고리 등록
                </Link> 


                <Link 
                    to={'/admin/ip'} 
                    className="flex items-center justify-center h-24 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:bg-gray-50 transition-all text-gray-700 font-medium text-lg"
                >
                    아이피 등록
                </Link> 

                <Link 
                    to={'/admin/settlement'} 
                    className="flex items-center justify-center h-24 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:bg-gray-50 transition-all text-gray-700 font-medium text-lg"
                >
                    수동 정산
                </Link>

{/*
                <Link 
                    to={"/admin/users"} 
                    className="flex items-center justify-center h-24 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:bg-gray-50 transition-all text-gray-700 font-medium text-lg"
                >
                    유저 관리
                </Link> 
                
                <Link 
                    to={"/admin/product"} 
                    className="flex items-center justify-center h-24 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:bg-gray-50 transition-all text-gray-700 font-medium text-lg"
                >
                    상품 관리
                </Link> 
                
                <Link 
                    to={"/admin/board"} 
                    className="flex items-center justify-center h-24 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:bg-gray-50 transition-all text-gray-700 font-medium text-lg"
                >
                    게시판 관리
                </Link> 
 */}
 
            </div>
        </div>
    );
}

export default Admin;