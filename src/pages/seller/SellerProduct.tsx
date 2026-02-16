import { useEffect, useState } from "react";
import { getSellerProductList } from "../../api/sellerApi";
import type { ProductInfo } from "../../types/productInfo";

interface ProductListResponse {
    items: ProductInfo[];
}

function SellerProduct() {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<ProductInfo[]>([]);
    
    const [searchKeyword, setSearchKeyword] = useState('');
    const [category, setCategory] = useState('');
    
    const [page, setPage] = useState(1);

    const fetchProducts = async (currentPage: number) => {
        try {
            setLoading(true);
            
            const data: ProductListResponse = await getSellerProductList({
                search: searchKeyword,
                category: category,
                page: currentPage,
                size: 10
            });

            setProducts(data.items || []); 

        } catch (error) {
            console.error("상품 로딩 실패:", error);
            alert("상품 목록을 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(page);
    }, [page]);

    const handleSearch = () => {
        setPage(1); 
        fetchProducts(1);
    };

    return (
        <div>
            <h1>제품 관리 (판매자)</h1>

            <div>
                <input 
                    type="text" 
                    placeholder="카테고리 입력"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />
                <input 
                    type="text" 
                    placeholder="상품명 검색"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button onClick={handleSearch}>검색</button>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <table border={1}>
                    <thead>
                        <tr>
                            <th>이미지</th>
                            <th>상품코드</th>
                            <th>상품명</th>
                            <th>카테고리</th>
                            <th>가격</th>
                            <th>판매가</th>
                            <th>상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 ? (
                            products.map((product) => (
                                <tr key={product.productsCode}>
                                    <td>
                                        <img src={product.imageUrl} alt={product.name} width="50" />
                                    </td>
                                    <td>{product.productsCode}</td>
                                    <td>{product.name}</td>
                                    <td>{product.category?.join(', ')}</td>
                                    <td>{product.price.toLocaleString()}원</td>
                                    <td>{product.salePrice.toLocaleString()}원</td>
                                    <td>{product.status}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7}>
                                    검색된 상품이 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}

            <div>
                <button 
                    disabled={page === 1} 
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                >
                    이전
                </button>
                <span> 현재 페이지: {page} </span>
                <button 
                    onClick={() => setPage(prev => prev + 1)}
                    disabled={products.length < 10}
                >
                    다음
                </button>
            </div>
        </div>
    );
}

export default SellerProduct;