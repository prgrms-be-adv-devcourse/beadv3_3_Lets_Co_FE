import { useState, useEffect, type FormEvent } from "react";
import AddProductOption from "../../components/AddProductOption";
import { useNavigate } from "react-router-dom";
import { PRODUCT_STATUS_OPTIONS } from "../../types/productStatus";
import { addProduct } from "../../api/sellerApi";
import type { UpsertProductRequest } from "../../types/request/upsertProductRequest";
import ImageUpload from "../../components/ImpageUpload";
import { getCategory, getIP } from "../../api/productApi";
import type { CategorySortedResponse } from "../../types/response/categorySortedResponse";
import type { ProductOptionInfo } from "../../types/productOptionInfo";
import CategoryTree from "../../components/CategoryTree";

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
        
        if (!ipCode) {
            alert("아이피를 선택해주세요.");
            return;
        }

        const productData: UpsertProductRequest = {
            name: productName,
            description: description,
            price: price,
            salePrice: salePrice,
            stock: 0,
            status: productStatus,
            categoryCode: categoryCode,
            ipCode: ipCode,
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
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-10">
                
                {/* 헤더 영역 */}
                <div className="mb-8 border-b border-gray-100 pb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <span className="w-1.5 h-7 bg-blue-600 rounded-full inline-block"></span>
                        제품 등록
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 ml-3">
                        판매하실 상품의 기본 정보, 분류, 이미지를 입력해주세요.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    
                    {/* 기본 정보 섹션 */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-800 border-b pb-2">기본 정보</h3>
                        
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                상품명 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                placeholder="상품명을 입력하세요"
                                required 
                                className="w-full bg-white border border-gray-300 text-gray-900 text-base rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-3.5 transition-all outline-none"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">상세설명</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="상품에 대한 상세 설명을 입력하세요"
                                rows={15}
                                className="w-full bg-white border border-gray-300 text-gray-900 text-base rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-3.5 transition-all outline-none resize-none"
                            />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">가격</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(Number(e.target.value))}
                                        placeholder="0"
                                        min="0"
                                        className="w-full bg-white border border-gray-300 text-gray-900 text-base rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-3.5 pr-10 transition-all outline-none"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">원</span>
                                </div>
                            </div>      

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">할인가</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={salePrice}
                                        onChange={(e) => setSalePrice(Number(e.target.value))}
                                        placeholder="0"
                                        min="0"
                                        className="w-full bg-white border border-gray-300 text-gray-900 text-base rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-3.5 pr-10 transition-all outline-none"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">원</span>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">제품 상태</label>
                            <select
                                value={productStatus}
                                onChange={(e) => setProductStatus(e.target.value)}
                                className="w-full bg-white border border-gray-300 text-gray-900 text-base rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-3.5 transition-colors outline-none cursor-pointer appearance-none hover:bg-gray-50"
                            >
                                {PRODUCT_STATUS_OPTIONS.map((status) => (
                                    <option key={status.value} value={status.value}>
                                        {status.label}
                                    </option>
                                ))}
                            </select>
                        </div> 
                    </div>

                    <hr className="border-gray-100" />

                    {/* 카테고리 및 아이피(IP) 섹션 */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-800 border-b pb-2">분류 설정</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* 카테고리 트리 UI */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    카테고리 선택 <span className="text-red-500">*</span>
                                </label>
                                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                                    {categories.length > 0 ? (
                                        <CategoryTree 
                                            categories={categories}
                                            selectedCategory={categoryCode}
                                            onSelect={setCategoryCode}
                                        />
                                    ) : (
                                        <div className="flex justify-center items-center h-24 text-gray-400 text-sm">
                                            카테고리를 불러오는 중입니다...
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 아이피 트리 UI */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    아이피 선택 <span className="text-red-500">*</span>
                                </label>
                                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                                    {ips.length > 0 ? (
                                        <CategoryTree 
                                            categories={ips} 
                                            selectedCategory={ipCode} 
                                            onSelect={setIPCode}
                                        />
                                    ) : (
                                        <div className="flex justify-center items-center h-24 text-gray-400 text-sm">
                                            아이피를 불러오는 중입니다...
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100" />
                    
                    {/* 옵션 설정 섹션 */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-800 border-b pb-2">옵션 설정</h3>
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <AddProductOption 
                                options={options} 
                                setOptions={setOptions}
                            />     
                        </div>
                    </div>           

                    
                    <hr className="border-gray-100" />

                    {/* 이미지 등록 섹션 */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-800 border-b pb-2">이미지 등록</h3>
                        {/* ✅ 문제가 되었던 h-40 속성을 제거하여 자유롭게 확장되도록 수정 */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <ImageUpload onFilesSelected={handleImageSelect} />
                        </div>
                    </div>

                    {/* 등록 버튼 */}
                    <div className="pt-6">
                        <button 
                            type="submit"
                            className="w-full bg-blue-600 text-white font-bold text-lg py-4 rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg transition-all"
                        >
                            상품 등록하기
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default AddProduct;