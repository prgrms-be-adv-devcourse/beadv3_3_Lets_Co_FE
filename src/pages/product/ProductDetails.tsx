import { useEffect, useState, useRef, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct } from "../../api/productApi";
import { addCart } from "../../api/cartApi";
import { order } from "../../api/orderApi";

import type { ProductDetailsResponse } from "../../types/response/productDetailsResponse";
import type { ProductOptionInfo } from "../../types/productOptionInfo";
import type { OrderRequest } from "../../types/request/orderRequest";
import type { ProductRequest } from "../../types/request/productRequest";

import ProductOptionList from "../../components/ProductOptionList";
import QnA from "../board/QnA";
import QueueModal from "../../components/QueueModal";
import type { WaitingQueueResponse } from "../../types/response/waitingQueueResponse";
import { enterRegister, enterStatus } from "../../api/queue";

function ProductDetails() {
    const { productCode } = useParams<{ productCode: string }>();
    const navigate = useNavigate();

    const [product, setProduct] = useState<ProductDetailsResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const [selectedOptionCode, setSelectedOptionCode] = useState<string>("");
    const [quantity, setQuantity] = useState<number>(1);
    const [mainImage, setMainImage] = useState<string>("");

    const [isWaiting, setIsWaiting] = useState<boolean>(false);
    const [queueInfo, setQueueInfo] = useState<WaitingQueueResponse | null>(null);
    
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    useEffect(() => {
        if (!productCode) return;

        const fetchProductData = async () => {
            try {
                const data = await getProduct(productCode);
                setProduct(data);
                
                if (data.images && data.images.length > 0) {
                    setMainImage(data.images[0].urls);
                }
            } catch (error) {
                console.error("상품 정보를 불러오는데 실패했습니다.", error);
                alert("상품 정보를 불러올 수 없습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
    }, [productCode]);

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

    // --- 공통 대기열 처리 함수 로직 ---
    const handleQueueAndExecute = async (actionCallback: () => void) => {
        try {
            setIsWaiting(true);
            
            // 대기열 등록 (토큰 발급)
            const queueToken = await enterRegister();

            // 1초마다 상태 체크 (Polling)
            intervalRef.current = setInterval(async () => {
                try {
                    const status = await enterStatus(queueToken);
                    setQueueInfo(status);

                    // 내 차례가 되어 입장이 허용된 경우
                    if (status.isAllowed) {
                        if (intervalRef.current) clearInterval(intervalRef.current);
                        setIsWaiting(false);
                        
                        // 대기열 통과 후 원래 실행하려던 액션 실행
                        actionCallback();
                    }
                } catch (error) {
                    console.error("대기열 상태 확인 중 오류 발생:", error);
                    if (intervalRef.current) clearInterval(intervalRef.current);
                    setIsWaiting(false);
                    alert("대기열 확인 중 오류가 발생했습니다. 다시 시도해주세요.");
                }
            }, 1000);

        } catch (error) {
            console.error("대기열 등록 실패:", error);
            setIsWaiting(false);
            alert("대기열 진입에 실패했습니다.");
        }
    };

    const handleAddToCart = async () => {
        const selection = getValidSelection();
        if (!selection) return;

        handleQueueAndExecute(async () => {
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
        });
    };

    const handleBuyNow = async (e: FormEvent) => {
        e.preventDefault();

        const selection = getValidSelection();
        if (!selection) return;

        handleQueueAndExecute(async () => {
            const productInfo: ProductRequest = {
                productCode: selection.productCode,
                optionCode: selectedOptionCode,
                quantity: selection.quantity
            };

            const orderData: OrderRequest = {
                orderType: "DIRECT",
                productInfo: productInfo
            };

            try {
                const response = await order(orderData);
                const orderCode = response.data.orderCode;

                navigate("/payment", { 
                    state: { 
                        orderCode: orderCode,
                        orderType: "DIRECT",
                        productCode: selection.productCode,
                        optionCode: selection.optionCode,
                        quantity: selection.quantity
                    } 
                });
            } catch (error) {
                console.error(error);
                alert("주문 처리 중 오류가 발생했습니다.");
            }
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[60vh] text-gray-500">
                <p className="text-xl font-medium mb-4">상품 정보를 찾을 수 없습니다.</p>
                <button 
                    onClick={() => navigate(-1)} 
                    className="px-6 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                    이전 페이지로 돌아가기
                </button>
            </div>
        );
    }

    const categoryText = product.category && product.category.length > 0 
        ? product.category.map(c => c.categoryName).join(" > ") 
        : "미분류";

    const ipText = product.ip && product.ip.length > 0 
        ? product.ip.map(i => i.categoryName).join(" > ") 
        : "";

    const selectedOpt = product.options.find(opt => opt.code === selectedOptionCode);
    const basePrice = product.price;
    const currentUnitPrice = selectedOpt ? selectedOpt.price : basePrice;
    const totalPrice = currentUnitPrice * quantity;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
            <div className="flex flex-col lg:flex-row gap-12 mb-16">
                
                {/* 좌측: 이미지 갤러리 */}
                <div className="w-full lg:w-1/2 flex flex-col gap-4">
                    <div className="aspect-square bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden relative">
                        {mainImage ? (
                            <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                이미지가 없습니다
                            </div>
                        )}
                        {product.status === "SOLD_OUT" && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                                <span className="bg-red-500 text-white px-6 py-2 text-lg font-bold rounded-full shadow-lg">
                                    품절
                                </span>
                            </div>
                        )}
                    </div>
                    
                    {product.images && product.images.length > 1 && (
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {product.images.map((img, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => setMainImage(img.urls)}
                                    className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                                        mainImage === img.urls ? "border-blue-600 opacity-100" : "border-transparent opacity-60 hover:opacity-100"
                                    }`}
                                >
                                    <img src={img.urls} alt={`썸네일 ${idx + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* 우측: 상품 기본 정보 및 옵션 폼 */}
                <div className="w-full lg:w-1/2 flex flex-col">
                    
                    <div className="flex flex-col gap-1 mb-3">
                        <span className="text-sm font-bold text-blue-600">
                            {categoryText}
                        </span>
                        {ipText && (
                            <span className="text-sm font-medium text-purple-500">
                                {ipText}
                            </span>
                        )}
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                        {product.name}
                    </h1>
                    
                    <div className="flex items-end justify-between border-b border-gray-100 pb-6 mb-6">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl font-bold text-gray-900">{product.price.toLocaleString()}원</span>
                        </div>
                        <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-md">
                            조회 {product.viewCount}
                        </span>
                    </div>

                    <form onSubmit={handleBuyNow} className="flex flex-col flex-grow">
                        <div className="mb-5">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">옵션 선택</label>
                            <select 
                                value={selectedOptionCode} 
                                onChange={(e) => setSelectedOptionCode(e.target.value)}
                                required
                                className="w-full bg-white border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-3.5 transition-colors outline-none cursor-pointer appearance-none"
                            >
                                <option value="" disabled>-- 구매하실 옵션을 선택해주세요 --</option>
                                {product.options.map((opt: ProductOptionInfo) => (
                                    <option 
                                        key={opt.code} 
                                        value={opt.code}
                                        disabled={opt.stock <= 0}
                                    >
                                        {opt.name} {opt.stock <= 0 ? "(품절)" : `(+${opt.price.toLocaleString()}원)`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">수량</label>
                            <div className="flex items-center border border-gray-300 rounded-lg w-fit overflow-hidden bg-white">
                                <button 
                                    type="button" 
                                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                    className="px-4 py-3 text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none"
                                >
                                    -
                                </button>
                                <input 
                                    type="number" 
                                    value={quantity} 
                                    min="1" 
                                    max="99"
                                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                                    className="w-16 text-center font-medium border-x border-gray-300 py-3 focus:outline-none appearance-none"
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setQuantity(prev => prev + 1)}
                                    className="px-4 py-3 text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="mt-auto bg-gray-50 p-5 rounded-xl border border-gray-100 flex justify-between items-center mb-6">
                            <span className="text-gray-600 font-medium">총 상품 금액</span>
                            <div className="text-right">
                                <span className="text-sm text-gray-500 mr-2">총 {quantity}개</span>
                                <span className="text-2xl font-bold text-blue-600">{totalPrice.toLocaleString()}원</span>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-auto">
                            <button 
                                type="button" 
                                onClick={handleAddToCart}
                                disabled={product.status === "SOLD_OUT"}
                                className="flex-1 bg-white border-2 border-blue-600 text-blue-600 font-bold text-lg py-4 rounded-xl hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:border-gray-300 disabled:text-gray-400 disabled:bg-gray-50"
                            >
                                장바구니
                            </button>
                            <button 
                                type="submit"
                                disabled={product.status === "SOLD_OUT"}
                                className="flex-1 bg-blue-600 text-white font-bold text-lg py-4 rounded-xl shadow-md hover:bg-blue-700 transition-all disabled:opacity-50 disabled:bg-gray-400 disabled:shadow-none"
                            >
                                바로 구매하기
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* 하단 상세 정보 영역 */}
            <div className="mt-20 border-t border-gray-200 pt-16">
                <section className="mb-20">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                        상품 상세 설명
                    </h2>
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-gray-700 leading-relaxed whitespace-pre-wrap min-h-[200px]">
                        {product.description}
                    </div>
                </section>

                <section className="mb-20">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                        상세 스펙 및 옵션 정보
                    </h2>
                    <ProductOptionList options={product.options} />
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                        상품 문의
                    </h2>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <QnA productcode={product.productsCode} />
                    </div>
                </section>
            </div>

            <QueueModal isOpen={isWaiting} queueInfo={queueInfo} />

        </div>
    );
}

export default ProductDetails;