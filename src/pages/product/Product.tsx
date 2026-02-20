import { useEffect, useState } from "react";
import { getProducts } from "../../api/productApi";
import { Link } from "react-router-dom";
import type { ProductInfo } from "../../types/productInfo"; 

interface ProductProps {
  searchKeyword: string;
}

export default function Product({ searchKeyword }: ProductProps) {
    const [products, setProducts] = useState<ProductInfo[]>([]); 
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
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPage(0);
    }, [searchKeyword]);

    useEffect(() => {
        fetchProducts(searchKeyword, page);
    }, [searchKeyword, page]); 

    const prev = () => { 
        setPage((prev) => Math.max(0, prev - 1))
    }
    
    return (
        <div>
            <h2>상품 리스트</h2>
            <hr/>

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
                                <div>
                                    <p>
                                        {product.price.toLocaleString()}원
                                    </p>
                                    <p>
                                        {product.salePrice.toLocaleString()}원
                                    </p>
                                </div>
                                <span>조회수: {product.viewCount}</span>
                            </div>
                        ))
                    )}
                </div>
            )}

            <div className="flex gap-4">
                <button 
                    onClick={prev}
                    disabled={page === 0}
                >
                    이전
                </button>

                <span>현재 페이지: {page + 1}</span>

                <button 
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={products.length < PAGE_SIZE} 
                >
                    다음
                </button>
            </div>
        </div>
    );
};