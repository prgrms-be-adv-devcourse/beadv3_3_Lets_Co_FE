import { Link } from "react-router-dom";

function Seller() {
    
    return (
        <div>
            <h1>판매자 페이지</h1>
            <Link to='/seller/product/add'>상품 등록</Link> <br/>
            <Link to='/seller/product/list'>제품 관리 페이지</Link> <br/>
        </div>
    );
}

export default Seller;