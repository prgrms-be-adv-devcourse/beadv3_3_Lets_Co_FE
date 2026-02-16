import { useEffect, useState } from "react";
import Search from "../../components/Search";
import { getProducts } from "../../api/productApi";
import { Link } from "react-router-dom";
import type { ProductInfo } from "../../types/productInfo"; 

export default function Product() {

    // 여기에 함수를 변수로 선언해서 넣을 수 있음 (이벤트 헨들러)
    const prev = () => { 
        // 여기에 코드를 작성
        setPage((prev) => Math.max(0, prev - 1))
    }
    
    const [products, setProducts] = useState<ProductInfo[]>([]); 
    const [searchKeyword, setSearchKeyword] = useState('');
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);

    const PAGE_SIZE = 5;

    const fetchProducts = async (keyword: string, pageNum: number) => {
        try {
            setLoading(true);
            const data = await getProducts(keyword, pageNum, PAGE_SIZE);
            
            if (data && data.items) {
                setProducts(data.items);
            }
        } catch (error) {
            
            const err = error as any; 
            if (err.response && err.response.status === 404) {
                setProducts([]); 
                return; 
            }

            console.error("상품 로딩 실패:", error);
            alert("상품 목록을 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(searchKeyword, page);
    }, [page]); 

    const handleSearch = (keyword: string) => {
        setSearchKeyword(keyword);
        
        if (page !== 0) {
            setPage(0);
        } else {
            fetchProducts(keyword, 0);
        }
    };

    return (
        <div>
            <h2>상품 리스트</h2>
            
            <Search onSearch={handleSearch} />
            
            <hr />

            {loading ? (
                <div>로딩 중...</div>
            ) : (
                <div>
                    {products.length === 0 ? (
                        <p>검색 결과가 없습니다.</p>
                    ) : (
                        products.map((product) => (
                            <div key={product.productsCode}>
                                <Link to={`/products/${product.productsCode}`}>
                                    <h3>{product.name}</h3>
                                </Link>
                                <p>코드: {product.productsCode}</p>
                                <p> 
                                    {product.price.toLocaleString()}원
                                </p>
                                <p>
                                    {product.salePrice.toLocaleString()}원
                                </p>
                                <span>조회수: {product.viewCount}</span>
                            </div>
                        ))
                    )}
                </div>
            )}

            <div>
                <button 
                    onClick={prev}
                    disabled={page === 0}
                >
                    이전
                </button>

                <span>현재 페이지: {page + 1}</span>

                <button 
                    // 인라인 방식
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={products.length < PAGE_SIZE} 
                >
                    다음
                </button>
            </div>
        </div>
    );
};