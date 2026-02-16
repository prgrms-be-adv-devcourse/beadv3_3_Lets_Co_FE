import { useState, type FormEvent } from "react";
import AddProductOption from "../../components/AddProductOption";
import type { ProductOptionInfo } from "../../types/productOptionInfo"; 
import { useNavigate } from "react-router-dom";
import { PRODUCT_STATUS_OPTIONS } from "../../types/productStatus";
import { addProduct } from "../../api/sellerApi";
import type { UpsertProductRequest } from "../../types/request/upsertProductRequest";
import ImageUpload from "../../components/ImpageUpload";

function AddProduct () {

    const navigate = useNavigate();
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [salePrice, setSalePrice] = useState(0);
    const [productStatus, setProductStatus] = useState('ON_SALE');
    const [categoryStatus, setCategoryStatus] = useState('');
    const [ipStatus, setIpStatus] = useState('');

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

    const handleImageSelect = (files: File[]) => {
        setSelectedImages(files);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (options.length === 0) {
            alert("최소 1개의 옵션을 등록해야 합니다.");
            return;
        }

        const productData: UpsertProductRequest = {
            name: productName,
            description: description,
            price: price,
            salePrice: salePrice,
            stock: 0,
            status: productStatus,
            categoryCode: categoryStatus,
            ipCode: ipStatus,
            options: options
        }

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
                
{/* 
                <div>
                    <label>카테고리</label>
                    <select
                        value={categoryStatus}
                        onChange={(e) => setCategoryStatus(e.target.value)}
                    >
                    </select>
                </div>

                <div>
                    <label>아이피</label>
                    <select
                        value={ipStatus}
                        onChange={(e) => setIpStatus(e.target.value)}
                    >
                    </select>
                </div>
 */}

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