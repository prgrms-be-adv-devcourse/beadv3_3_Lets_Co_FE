import { useEffect, useState, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct } from "../../api/productApi";
import { addCart } from "../../api/cartApi";
import type { ProductDetailResponse } from "../../types/response/productDetailResponse";
import type { ProductOptionInfo } from "../../types/productOptionInfo";
import ProductOptionList from "../../components/ProductOptionList";

function ProductDetails() {
    const { optionCode } = useParams<{ optionCode: string }>(); 
    const navigate = useNavigate();

    const [product, setProduct] = useState<ProductDetailResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const [selectedOptionCode, setSelectedOptionCode] = useState<string>("");
    const [quantity, setQuantity] = useState<number>(1);

    useEffect(() => {
        if (!optionCode) return;

        const fetchProductData = async () => {
            try {
                const data = await getProduct(optionCode);
                setProduct(data);
            } catch (error) {
                console.error("상품 정보를 불러오는데 실패했습니다.", error);
                alert("상품 정보를 불러올 수 없습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
    }, [optionCode]);

    const getValidSelection = () => {
        if (!product) return null;

        if (!selectedOptionCode) {
            alert("구매하실 옵션을 선택해주세요.");
            return null;
        }

        if (quantity < 1) {
            alert("수량은 최소 1개 이상이어야 합니다.");
            return null;
        }

        const selectedOption = product.options.find(opt => opt.code === selectedOptionCode);

        if (!selectedOption) {
            alert("유효하지 않은 옵션입니다.");
            return null;
        }

        if (selectedOption.stock <= 0) {
            alert("품절된 옵션입니다.");
            return null;
        }

        return {
            productCode: product.productsCode,
            optionCode: selectedOption.code,
            quantity: quantity
        };
    };

    const handleAddToCart = async () => {
        const selection = getValidSelection();
        if (!selection) return;

        try {
            await addCart({
                productCode: selection.productCode,
                optionCode: selection.optionCode,
                quantity: selection.quantity
            });

            if (window.confirm("장바구니에 상품을 담았습니다.\n장바구니로 이동하시겠습니까?")) {
                navigate("/cart");
            }
        } catch (error) {
            console.error(error);
            alert("장바구니 담기에 실패했습니다.");
        }
    };

    const handleBuyNow = (e: FormEvent) => {
        e.preventDefault();

        const selection = getValidSelection();
        if (!selection) return;

        const orderParams = {
            productCode: selection.productCode,
            optionCode: selection.optionCode,
            quantity: selection.quantity,
            orderType: "DIRECT"
        };

        // alert() -> 이러면 씹힐 때가 있음 (시간차 때문에 -> 그래서 토스트 사용해서 js로 구현)
        navigate("/payment", { state: orderParams });
    };

    if (loading) return <div>로딩 중...</div>;
    if (!product) return <div>상품 정보 없음</div>;

    return (
        <div>
            <h1>상품 상세 페이지</h1>

            <div>
                <h3>제품 정보</h3>
                <p>제품명: {product.name}</p>
                <p>가격: {product.price.toLocaleString()}원</p>
                <p>조회수: {product.viewCount}</p>
                
                <hr />
                
                <ProductOptionList options={product.options} />
            </div>

            <div>
                <h3>구매 옵션 선택</h3>
                
                <form onSubmit={handleBuyNow}>
                    <div>
                        <label>옵션: </label>
                        <select 
                            value={selectedOptionCode} 
                            onChange={(e) => setSelectedOptionCode(e.target.value)}
                            required
                        >
                            <option value="">-- 옵션 선택 --</option>
                            {product.options.map((opt: ProductOptionInfo) => (
                                <option 
                                    key={opt.code} 
                                    value={opt.code}
                                    disabled={opt.stock <= 0}
                                >
                                    {opt.name} 
                                    {opt.stock <= 0 ? " (품절)" : ` (${opt.price.toLocaleString()}원)`}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>수량: </label>
                        <input 
                            type="number" 
                            value={quantity} 
                            min="1" 
                            max={99}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                        />
                    </div>

                    <div>
                        <button type="button" onClick={handleAddToCart}>
                            장바구니 담기
                        </button>

                        <button type="submit">
                            바로 구매하기
                        </button>
                    </div>
                </form>
                
                <hr />
                
                <h3>제품 상세 설명</h3>
                <p>{product.description}</p>
            </div>
        </div>
    );
}

export default ProductDetails