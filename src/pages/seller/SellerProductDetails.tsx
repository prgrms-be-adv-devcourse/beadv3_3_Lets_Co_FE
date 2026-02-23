import { useEffect, useState, type ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSellerProductDetails, updateSellerProduct,  deleteSellerProduct } from "../../api/sellerApi";
import type { SellerProductDetailsResponse } from "../../types/response/sellerProductDetailsResponse";
import type { UpsertProductRequest } from "../../types/request/upsertProductRequest";

function SellerProductDetails() {
    const { code } = useParams<{ code: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState<SellerProductDetailsResponse | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    // 수정용 폼 데이터 상태
    const [formData, setFormData] = useState<UpsertProductRequest>({
        name: '',
        description: '',
        price: 0,
        salePrice: 0,
        stock: 0,
        status: 'SALE',
        options: [],
        categoryCode: '',
        ipCode: ''
    });

    // 수정용 이미지 파일 상태
    const [newImages, setNewImages] = useState<File[]>([]);

    // 상세 조회 함수
    const fetchProduct = async () => {
        if (!code) return;
        try {
            setLoading(true);
            const data = await getSellerProductDetails(code);
            setProduct(data);
            
            // 수정 모드를 대비해 폼 데이터 초기화
            setFormData({
                name: data.name,
                description: data.description,
                price: data.price,
                salePrice: data.salePrice,
                stock: data.stock,
                status: data.status,
                options: data.options,
                categoryCode: data.category.length > 0 ? data.category[0].categoryCode : '',
                ipCode: data.ip.length > 0 ? data.ip[0].categoryCode : ''
            });

        } catch (error) {
            console.error("Failed to fetch product:", error);
            alert("상품 정보를 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [code]);

    // 삭제 핸들러
    const handleDelete = async () => {
        if (!code) return;
        if (!window.confirm("정말로 이 상품을 삭제하시겠습니까?")) return;

        try {
            setLoading(true);
            await deleteSellerProduct(code);
            alert("삭제되었습니다.");
            navigate(-1);
        } catch (error) {
            console.error("Delete failed:", error);
            alert("삭제에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // 수정 핸들러 (저장)
    const handleUpdate = async () => {
        if (!code) return;
        if (!window.confirm("상품 정보를 수정하시겠습니까?")) return;

        try {
            setLoading(true);
            await updateSellerProduct(code, formData, newImages);
            
            alert("수정되었습니다.");
            setIsEditing(false);
            setNewImages([]);
            fetchProduct();
        } catch (error) {
            console.error("Update failed:", error);
            alert("수정에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // 입력값 변경 핸들러
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'salePrice' || name === 'stock' ? Number(value) : value
        }));
    };

    // 파일 선택 핸들러
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setNewImages(Array.from(e.target.files));
        }
    };

    if (loading && !product) return <div>Loading...</div>;
    if (!product) return <div>상품 정보가 없습니다.</div>;

    return (
        <div>
            <h1>{isEditing ? "상품 수정" : "상품 상세 정보"}</h1>

            <div>
                {!isEditing ? (
                    <>
                        <button onClick={() => setIsEditing(true)}>수정하기</button>
                        <button onClick={handleDelete}>삭제하기</button>
                        <button onClick={() => navigate(-1)}>목록으로</button>
                    </>
                ) : (
                    <>
                        <button onClick={handleUpdate}>저장</button>
                        <button onClick={() => setIsEditing(false)}>취소</button>
                    </>
                )}
            </div>

            <div>
                <div>
                    <h3>상품 이미지</h3>
                    {isEditing ? (
                         <div>
                            <p>기존 이미지는 대체됩니다 (새 파일 선택 시).</p>
                            <input type="file" multiple onChange={handleFileChange} />
                         </div>
                    ) : (
                        <div>
                            {product.images.map((img, idx) => (
                                <img 
                                    key={idx} 
                                    src={img.urls} 
                                    alt={`product-${idx}`} 
                              />
                            ))}
                        </div>
                    )}
                </div>

                <hr />

                <div>
                    
                    <div>
                        <strong>상품 코드:</strong>
                        <p>{product.productsCode}</p>
                    </div>

                    <div>
                        <strong>상품명:</strong>
                        {isEditing ? (
                            <input 
                                type="text" 
                                name="name" 
                                value={formData.name} 
                                onChange={handleChange} 
                            />
                        ) : (
                            <p>{product.name}</p>
                        )}
                    </div>

                    {/* 카테고리 & IP */}
                    <div>
                        <div>
                            <strong>카테고리:</strong>
                            {isEditing ? (
                                <input 
                                    type="text" 
                                    name="categoryCode" 
                                    placeholder="카테고리 코드 입력"
                                    value={formData.categoryCode} 
                                    onChange={handleChange} 
                                />
                            ) : (
                                <p>
                                    {product.category.map(c => c.categoryName).join(', ')}
                                </p>
                            )}
                        </div>
                        <div>
                            <strong>IP:</strong>
                            {isEditing ? (
                                <input 
                                    type="text" 
                                    name="ipCode" 
                                    placeholder="IP 코드 입력"
                                    value={formData.ipCode} 
                                    onChange={handleChange} 
                                />
                            ) : (
                                <p>
                                    {product.ip.map(i => i.categoryName).join(', ')}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* 가격 정보 */}
                    <div>
                        <div>
                            <strong>정가:</strong>
                            {isEditing ? (
                                <input type="number" name="price" value={formData.price} onChange={handleChange} />
                            ) : (
                                <p>
                                    {product.price.toLocaleString()}원
                                </p>
                            )}
                        </div>
                        <div>
                            <strong>판매가:</strong>
                            {isEditing ? (
                                <input type="number" name="salePrice" value={formData.salePrice} onChange={handleChange} />
                            ) : (
                                <p>
                                    {product.salePrice.toLocaleString()}원
                                </p>
                            )}
                        </div>
                    </div>

                    {/* 재고 및 상태 */}
                    <div>
                        <div>
                            <strong>재고:</strong>
                            {isEditing ? (
                                <input type="number" name="stock" value={formData.stock} onChange={handleChange} />
                            ) : (
                                <p>{product.stock}개</p>
                            )}
                        </div>
                        <div>
                            <strong>상태:</strong>
                            {isEditing ? (
                                <select name="status" value={formData.status} onChange={handleChange}>
                                    <option value="SALE">판매중</option>
                                    <option value="SOLD_OUT">품절</option>
                                    <option value="STOP">판매중지</option>
                                </select>
                            ) : (
                                <p>{product.status}</p>
                            )}
                        </div>
                    </div>

                    {/* 상세 설명 */}
                    <div>
                        <strong>상품 설명:</strong>
                        {isEditing ? (
                            <textarea 
                                name="description" 
                                rows={5} 
                                value={formData.description} 
                                onChange={handleChange} 
                            />
                        ) : (
                            <div> 
                                {product.description} 
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SellerProductDetails;