import { Link } from "react-router-dom";

function Board() {
    
    return (
        <div>
            <h1>게시판</h1>

            <Link to={'/board/notice'}>공지</Link> <br/>
            <Link to={'/board/inquiry'}>문의</Link>
        </div>
    );
}

export default Board;