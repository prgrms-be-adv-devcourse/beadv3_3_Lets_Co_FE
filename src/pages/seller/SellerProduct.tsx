import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 추가: 라우터 이동을 위한 훅
import { getSellerProductList } from "../../api/sellerApi";
import { getCategory, getIP } from "../../api/productApi";
import type { ProductListResponse } from "../../types/response/productListResponse";
import type { CategorySortedResponse } from "../../types/response/categorySortedResponse";
import CategoryTree from "../../components/CategoryTree";
import { PRODUCT_STATUS_LABELS } from "../../types/productStatus";

const findNameByCode = (nodes: CategorySortedResponse[], targetCode: string): string => {
    if (!targetCode) return ''; 
    
    for (const node of nodes) {
        if (node.categoryCode === targetCode) {
            return node.categoryName; 
        }
        if (node.children && node.children.length > 0) {
            const foundName = findNameByCode(node.children, targetCode);
            if (foundName) return foundName;
        }
    }
    return '';
};

function SellerProduct() {
    const navigate = useNavigate();

    const [products, setProducts] = useState<ProductListResponse[]>([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const PAGE_SIZE = 5;
    
    const [searchKeyword, setSearchKeyword] = useState('');
    const [categoryCode, setCategoryCode] = useState('');
    const [ipCode, setIpCode] = useState('');
    
    const [categories, setCategories] = useState<CategorySortedResponse[]>([]);
    const [ips, setIps] = useState<CategorySortedResponse[]>([]);

    useEffect(() => {
        const fetchFilterData = async () => {
            try {
                const [categoryData, ipData] = await Promise.all([
                    getCategory(),
                    getIP()
                ]);
                setCategories(categoryData);
                setIps(ipData);
            } catch (error) {
                console.error("분류 데이터 불러오기 실패:", error);
            }
        };
        fetchFilterData();
    }, []);

    const fetchProducts = async (pageNum: number) => {
        try {
            setLoading(true);
            
            const categoryName = findNameByCode(categories, categoryCode);
            const ipName = findNameByCode(ips, ipCode);
            
            const data = await getSellerProductList(
                pageNum, 
                PAGE_SIZE, 
                searchKeyword, 
                categoryName, 
                ipName
            );
            
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
        fetchProducts(page);
    }, [page]);

    const handleSearch = () => {
        if (page === 0) {
            fetchProducts(0);
        } else {
            setPage(0);
        }
    };

    const prev = () => {
        setPage((prev) => Math.max(0, prev - 1));
    };

    return (
        <div>
            <h1>제품 관리 (판매자)</h1>

            <hr />

            <div>
                <div>
                    <h3>상품명 검색</h3>
                    <input 
                        type="text" 
                        value={searchKeyword} 
                        onChange={(e) => setSearchKeyword(e.target.value)} 
                        placeholder="검색어 입력" 
                    />
                </div>

                <div>
                    <h3>카테고리 선택</h3>
                    {categories.length > 0 ? (
                        <CategoryTree 
                            categories={categories}
                            selectedCategory={categoryCode}
                            onSelect={setCategoryCode}
                        />
                    ) : (
                        <span>카테고리 로딩중...</span>
                    )}
                </div>

                <div>
                    <h3>아이피 선택</h3>
                    {ips.length > 0 ? (
                        <CategoryTree 
                            categories={ips} 
                            selectedCategory={ipCode} 
                            onSelect={setIpCode}
                        />
                    ) : (
                        <span>아이피 로딩중...</span>
                    )}
                </div>

                <br />
                <button onClick={handleSearch}>검색</button>
            </div>

            <hr />

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
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan={7}>검색 결과가 없습니다.</td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.productsCode}>
                                    <td>
                                        {product.imageUrl ? (
                                            <img src={product.imageUrl} alt={product.name} width="50" height="50" />
                                        ) : (
                                            "이미지 없음"
                                        )}
                                    </td>
                                    <td>{product.productsCode}</td>
                                    <td 
                                        onClick={() => navigate(`/seller/product/${product.productsCode}`)}
                                        style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
                                    >
                                        {product.name}
                                    </td>
                                    <td>{product.category?.join(', ')}</td>
                                    <td>{product.price}원</td>
                                    <td>{product.salePrice}원</td>
                                    <td>{PRODUCT_STATUS_LABELS[product.status] || product.status}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}

            <div>
                <button onClick={prev} disabled={page === 0}>
                    이전
                </button>
                <span> {page + 1} 페이지 </span>
                <button onClick={() => setPage((prev) => prev + 1)} disabled={products.length < PAGE_SIZE}>
                    다음
                </button>
            </div>
        </div>
    );
}

export default SellerProduct;