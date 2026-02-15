import { Link } from "react-router-dom";

function Admin () {
    
    return (
        <div>
            <h1>관리자 페이지</h1>
            <Link to={"/admin/users"}>유저 관리</Link> <br/>
            <Link to={"/admin/product"}>상품 관리</Link> <br/>
            <Link to={"/admin/board"}>게시판 관리</Link>
        </div>
    );
}

export default Admin;