import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function SideNav() {
    const { userRole } = useAuth();

    return (
        <div className="flex items-start justify-center gap-2 p-2">
            {userRole === "USERS" && (
                <Link 
                    to='/seller/register' 
                    className="px-2 py-1 hover:font-bold hover:underline hover:text-blue-500"
                >
                    판매자 신청
                </Link>
            )}

            {userRole === "SELLER" && (
                <Link 
                    to='/seller' 
                    className="px-2 py-1 hover:font-bold hover:underline hover:text-blue-500"
                >
                    판매자 페이지
                </Link>
            )}

            {userRole === "ADMIN" && (
                <Link 
                    to='/admin' 
                    className="px-2 py-1 hover:font-bold hover:underline hover:text-blue-500"
                >
                    관리자 페이지
                </Link>
            )}
            
            <Link 
                to='/board' 
                className="px-2 py-1 hover:font-bold hover:underline hover:text-blue-500"
            >
                게시판 페이지
            </Link>
            
            <Link 
                to='/cart' 
                className="px-2 py-1 hover:font-bold hover:underline hover:text-blue-500"
            >
                장바구니 페이지
            </Link>
        </div>
    );
}

export default SideNav;