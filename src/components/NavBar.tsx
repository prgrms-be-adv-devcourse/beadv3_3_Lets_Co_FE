import { Link } from "react-router-dom";
import { logout } from "../api/authApi";

export default function NavBar() {

    return (
        <nav>
            <div style={{ display: "flex", gap: "20px" }}>
                <Link to="/">홈으로</Link>
                <Link to="/my">마이페이지</Link>
                <Link to="/login">로그인</Link>
                <button onClick={logout}>로그아웃</button>
            </div>
        </nav>
    );
};
