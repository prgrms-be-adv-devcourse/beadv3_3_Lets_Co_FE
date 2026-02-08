import { Link } from "react-router-dom";

export default function Sector() {

    return (
        <div>
            <Link to='/seller/register'>판매자 신청</Link> <br/>
            <Link to='/seller'>판매자 페이지</Link> <br/>
            <Link to='/cart'>장바구니 페이지</Link> <br/>
            <Link to='/board'>게시판 페이지</Link> <br/>
        </div>
    );
}