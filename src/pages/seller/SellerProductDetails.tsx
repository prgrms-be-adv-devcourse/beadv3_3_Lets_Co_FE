import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSellerProductDetails, deleteSellerProduct } from "../../api/sellerApi";
import type { SellerProductDetailsResponse } from "../../types/response/sellerProductDetailsResponse";
import { PRODUCT_STATUS_LABELS } from "../../types/productStatus";

function SellerProductDetails() {
    const { code } = useParams<{ code: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState<SellerProductDetailsResponse | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!code) {
                setLoading(false);
                return;
            }

            try {
                const data = await getSellerProductDetails(code);
                setProduct(data);
            } catch (error) {
                console.error("상품 상세 조회 실패:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [code]);

    const handleDelete = async () => {
        if (!code) return;
        
        if (window.confirm("정말로 이 상품을 삭제하시겠습니까?")) {
            try {
                await deleteSellerProduct(code);
                alert("상품이 성공적으로 삭제되었습니다.");
                navigate(-1); 
            } catch (error) {
                console.error("상품 삭제 실패:", error);
                alert("상품 삭제 중 오류가 발생했습니다.");
            }
        }
    };

    if (loading) return <div>데이터를 불러오는 중입니다...</div>;
    
    if (!product) return <div>상품 정보가 없습니다.</div>;

    return (
        <div>
            <h1>상품 상세 정보</h1>
            <div>
                <button onClick={() => navigate(-1)}>목록으로</button>
                <button 
                    onClick={handleDelete} 
                >
                    삭제하기
                </button>
            </div>

            <hr />

            <div>
                <h3>상품 이미지</h3>
                <div>
                    {product.images && product.images.length > 0 ? (
                        product.images.map((img, idx) => (
                            <img 
                                key={idx} 
                                src={img.urls} 
                                alt={`product-${idx}`} 
                                width="200"
                            />
                        ))
                    ) : (
                        <p>등록된 이미지가 없습니다.</p>
                    )}
                </div>
            </div>

            <hr />

            <div>
                <p><strong>상품 코드:</strong> {product.productsCode}</p>
                <p><strong>상품명:</strong> {product.name}</p>
                <p>
                    <strong>카테고리:</strong>{' '}
                    {product.category && product.category.length > 0 
                        ? product.category.map(c => c.categoryName).join('>') 
                        : '카테고리 없음'}
                </p>
                <p>
                    <strong>IP:</strong>{' '}
                    {product.ip && product.ip.length > 0 
                        ? product.ip.map(i => i.categoryName).join('>') 
                        : 'IP 없음'}
                </p>
                <p><strong>정가:</strong> {product.price?.toLocaleString()}원</p>
                <p><strong>판매가:</strong> {product.salePrice?.toLocaleString()}원</p>
                <p><strong>재고:</strong> {product.stock}개</p>
                <p><strong>상태:</strong> {PRODUCT_STATUS_LABELS[product.status] || product.status}</p>
                
                <div>
                    <strong>상품 설명:</strong>
                    <div>
                        {product.description || '설명이 없습니다.'}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SellerProductDetails;