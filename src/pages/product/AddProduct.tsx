import { useState } from "react";
import ProductOption from "../../components/ProductOption";
import type { ProductOptionInfo } from "../../types/ProductOptionInfo";
import { useNavigate } from "react-router-dom";
import type { AddProductRequest } from "../../types/request/addProductRequest";
import { PRODUCT_STATUS_OPTIONS } from "../../types/productStatus";
import { addProduct } from "../../api/productApi";

export default function AddProduct () {

    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [salePrice, setSalePrice] = useState(0);
    const [stock, setStock] = useState(0);
    const [productStatus, setProductStatus] = useState('ON_SALE');
    const [options, setOptions] = useState<ProductOptionInfo[]>([]);

    const navigate = useNavigate();


    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();

        const productData: AddProductRequest = {
            name: productName,
            description: description,
            price: price,
            salePrice: salePrice,
            stock: stock,
            status: productStatus,
            options: options,
            images: [] 
        }

        
        try {
            await addProduct(productData);

            alert("상품이 정상적으로 등록되었습니다.");
            navigate('/seller');
        } catch (error) {
            console.log(productData);
            
            alert("알 수 없는 오류가 발생했습니다.");
            console.error("예상치 못한 에러:", error);
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
                    />
                </div>      

                <div>
                    <label>할인가:</label>
                    <input
                        type="number"
                        value={salePrice}
                        onChange={(e) => setSalePrice(Number(e.target.value))}
                        placeholder="할인가"
                    />
                </div>
                
                <div>
                    <label>재고:</label>
                    <input
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(Number(e.target.value))}
                        placeholder="상품명"
                    />
                </div>
                
                <div>
                    <label>상태:</label>
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

                <hr/>
                
                <ProductOption 
                    options={options} 
                    setOptions={setOptions}
                />

                <button type="submit">등록</button>
            </form>
        </div>
    );
}