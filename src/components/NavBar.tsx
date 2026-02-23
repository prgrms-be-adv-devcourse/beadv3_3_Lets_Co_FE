import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function NavBar() {
    const { isLogin, logout } = useAuth();

    return (
        <nav>
            <div className="flex gap-5">
                <Link to="/">홈으로</Link>
                {isLogin && <Link to="/my">마이페이지</Link>}
                
                {isLogin ? (
                    <button onClick={logout}>로그아웃</button>
                ) : (
                    <Link to="/login">로그인</Link>
                )}
            </div>
        </nav>
    );
};

export default NavBar;