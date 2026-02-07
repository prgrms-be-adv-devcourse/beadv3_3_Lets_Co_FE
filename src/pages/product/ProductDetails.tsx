import { useEffect, useState } from "react";
import ProductOptionList from "../../components/ProductOptionList";
import { getProduct } from "../../api/productApi";
import type { ProductDetailResponse } from "../../types/response/productDetailResponse";
import { useParams } from "react-router-dom";

export default function ProductDetails() {
    const { optionCode } = useParams<{ optionCode: string }>();
    const [product, setProduct] = useState<ProductDetailResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {

        if (!optionCode) return;

        const fetchProductData = async () => {
            try {
                const data = await getProduct(optionCode);
                setProduct(data);
            } catch (error) {
                console.error("상품 정보를 불러오는데 실패했습니다.", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
    }, []);

    if (loading) return <div>상품 정보를 불러오는 중...</div>;
    if (!product) return <div>상품 정보가 없습니다.</div>;

    return (
        <div>
            <h1>상품 상세</h1>

            <div>
                <label>코드(테스트용)</label>
                <div>{product.productsCode}</div>
                
                <label>상품명</label>
                <div>{product.name}</div>

                <label>상품 설명</label>
                <div>{product.description}</div>

                <label>판매가</label>
                <div>
                    {product.salePrice > 0 ? (
                        <>
                            <span>
                                {product.price.toLocaleString()}원
                            </span>
                            <span>
                                {product.salePrice.toLocaleString()}원
                            </span>
                        </>
                    ) : (
                        <span>{product.price.toLocaleString()}원</span>
                    )}
                </div>

                <label>조회수</label>
                <div>{product.viewCount}회</div>

                <label>재고 / 상태</label>
                <div>{product.stock}개 / {product.status}</div>
            </div>

            <ProductOptionList options={product.options} />
        </div>
    );
}