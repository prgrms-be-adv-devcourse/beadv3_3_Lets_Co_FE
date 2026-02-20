import { Link } from "react-router-dom";
import { logout } from "../api/authApi";

function NavBar() {

    return (
        <nav>
            <div  className="flex gap-5">
                <Link to="/">홈으로</Link>
                <Link to="/my">마이페이지</Link>
                <Link to="/login">로그인</Link>
                <button onClick={logout}>로그아웃</button>
            </div>
        </nav>
    );
};

export default NavBar;