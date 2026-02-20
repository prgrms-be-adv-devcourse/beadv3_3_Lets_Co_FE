import { Link } from "react-router-dom";

function SideNav() {
    return (
        <div className="flex items-start justify-center gap-2 p-2">
            <Link 
                to='/seller/register' 
                className="px-2 py-1 hover:font-bold hover:underline hover:text-blue-500"
            >
                판매자 신청
            </Link>
            <Link 
                to='/seller' 
                className="px-2 py-1 hover:font-bold hover:underline hover:text-blue-500"
            >
                판매자 페이지
            </Link>
            <Link 
                to='/admin' 
                className="px-2 py-1 hover:font-bold hover:underline hover:text-blue-500"
            >
                관리자 페이지
            </Link>
            <Link 
                to='/cart' 
                className="px-2 py-1 hover:font-bold hover:underline hover:text-blue-500"
            >
                장바구니 페이지
            </Link>
            <Link 
                to='/board' 
                className="px-2 py-1 hover:font-bold hover:underline hover:text-blue-500"
            >
                게시판 페이지
            </Link>
        </div>
    );
}

export default SideNav;