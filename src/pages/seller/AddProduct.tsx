// src/pages/seller/AddProduct.tsx
import { useState, useEffect, type FormEvent } from "react";
import AddProductOption from "../../components/AddProductOption";
import type { ProductOptionInfo } from "../../types/productOptionInfo"; 
import { useNavigate } from "react-router-dom";
import { PRODUCT_STATUS_OPTIONS } from "../../types/productStatus";
import { addProduct } from "../../api/sellerApi";
import type { UpsertProductRequest } from "../../types/request/upsertProductRequest";
import ImageUpload from "../../components/ImpageUpload";

// getIP 추가
import { getCategory, getIP } from "../../api/productApi";
import CategoryTree from "../../components/CategoryTree";
import type { CategorySortedResponse } from "../../types/response/CategorySortedResponse";

function AddProduct() {
    const navigate = useNavigate();
    
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [salePrice, setSalePrice] = useState(0);
    const [productStatus, setProductStatus] = useState('ON_SALE');
    
    // 카테고리 상태
    const [categories, setCategories] = useState<CategorySortedResponse[]>([]);
    const [categoryCode, setCategoryCode] = useState('');
    
    // 아이피 상태 추가
    const [ips, setIps] = useState<CategorySortedResponse[]>([]);
    const [ipCode, setIPCode] = useState('');

    const [selectedImages, setSelectedImages] = useState<File[]>([]);

    const [options, setOptions] = useState<ProductOptionInfo[]>([
        {
            code: '',
            name: '',
            sortOrder: 1,
            price: 0,
            salePrice: 0,
            stock: 0,
            status: 'ON_SALE'
        }
    ]);

    // 카테고리와 IP 정보를 동시에 불러오도록 수정
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Promise.all을 사용하여 병렬로 데이터 호출
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
        fetchData();
    }, []);

    const handleImageSelect = (files: File[]) => {
        setSelectedImages(files);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (options.length === 0) {
            alert("최소 1개의 옵션을 등록해야 합니다.");
            return;
        }

        if (!categoryCode) {
            alert("카테고리를 선택해주세요.");
            return;
        }
        
        // 필요에 따라 IP 선택 필수 여부 체크
        // if (!ipCode) {
        //     alert("아이피를 선택해주세요.");
        //     return;
        // }

        const productData: UpsertProductRequest = {
            name: productName,
            description: description,
            price: price,
            salePrice: salePrice,
            stock: 0,
            status: productStatus,
            categoryCode: categoryCode,
            ipCode: ipCode, // 정상적으로 선택된 ipCode가 전송됨
            options: options
        };

        try {
            await addProduct(productData, selectedImages);
            alert("상품이 정상적으로 등록되었습니다.");
            navigate('/seller');
        } catch (error) {
            console.error(error);
            alert("상품 등록 실패: 권한이 없거나 오류가 발생했습니다.");
        }
    };

    return (
        <div>
            <h1>제품 등록</h1>

            <form onSubmit={handleSubmit}>
                {/* 기존 입력 폼 유지 */}
                <div>
                    <label>상품명:</label>
                    <input
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="상품명"
                        required 
                    />
                </div>
                
                <div>
                    <label>상세설명:</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="상세설명"
                    />
                </div>
                
                <div>
                    <label>가격:</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        placeholder="가격"
                        min="0"
                    />
                </div>      

                <div>
                    <label>할인가:</label>
                    <input
                        type="number"
                        value={salePrice}
                        onChange={(e) => setSalePrice(Number(e.target.value))}
                        placeholder="할인가"
                        min="0"
                    />
                </div>
                
                <div>
                    <label>제품 상태:</label>
                    <select
                        value={productStatus}
                        onChange={(e) => setProductStatus(e.target.value)}
                    >
                        {PRODUCT_STATUS_OPTIONS.map((status) => (
                            <option key={status.value} value={status.value}>
                                {status.label}
                            </option>
                        ))}
                    </select>
                </div>     
                
                {/* 카테고리 트리 UI */}
                <div>
                    <label>카테고리 선택:</label>
                    <div>
                        {categories.length > 0 ? (
                            <CategoryTree 
                                categories={categories}
                                selectedCategory={categoryCode}
                                onSelect={setCategoryCode}
                                groupName="category" // 속성 추가: 라디오 그룹명 분리
                            />
                        ) : (
                            <p>카테고리를 불러오는 중입니다...</p>
                        )}
                    </div>
                </div>

                {/* 아이피 트리 UI (수정됨) */}
                <div>
                    <label>아이피 선택:</label>
                    <div>
                        {ips.length > 0 ? (
                            <CategoryTree 
                                categories={ips} // categories -> ips 로 변경
                                selectedCategory={ipCode} // categoryCode -> ipCode 로 변경
                                onSelect={setIPCode}
                                groupName="ip" // 속성 추가: 라디오 그룹명 분리
                            />
                        ) : (
                            <p>아이피를 불러오는 중입니다...</p>
                        )}
                    </div>
                </div>

                <ImageUpload onFilesSelected={handleImageSelect} />

                <hr/>
                
                <AddProductOption 
                    options={options} 
                    setOptions={setOptions}
                />                

                <button type="submit">등록</button>
            </form>
        </div>
    );
}

export default AddProduct;