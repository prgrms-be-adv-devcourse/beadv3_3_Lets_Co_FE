
import type { Dispatch, SetStateAction } from "react";
import type { ProductOptionInfo } from "../types/ProductOptionInfo";
import { PRODUCT_STATUS_OPTIONS } from "../types/productStatus";

interface Props {
    options: ProductOptionInfo[];
    setOptions: Dispatch<SetStateAction<ProductOptionInfo[]>>;
}

export default function ProductOption({options, setOptions}: Props) {

    const handleOptionChange = (index: number, field: keyof ProductOptionInfo, value: any) => {
            const newOptions = [...options];
            (newOptions[index] as any)[field] = value; 
            setOptions(newOptions);
        };

    const addOption = () => {
        const newOption: ProductOptionInfo = {
            name: '',
            sortOrder: 0,
            price: 0,
            salePrice: 0,
            stock: 0,
            status: 'ON_SALE'
        };
        setOptions([...options, newOption]);
    };

    const removeOption = (index: number) => {
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
    };

return (
        <div>
            <h3>옵션 정보</h3>

            {options.map((opt, index) => (
                <div key={index}>
                    <div>
                        <label>옵션명:</label>
                        <input 
                            type="text"
                            value={opt.name}
                            onChange={(e) => handleOptionChange(index, 'name', e.target.value)}
                            placeholder="옵션명"
                        />
                    </div>

                    <div>
                        <label>정렬순서:</label>
                        <input 
                            type="number"
                            placeholder="정렬순서"
                            value={opt.sortOrder}
                            onChange={(e) => handleOptionChange(index, 'sortOrder', Number(e.target.value))}
                        />
                    </div>

                    <div>
                        <label>금액:</label>
                        <input 
                            type="number"
                            placeholder="금액"
                            value={opt.price}
                            onChange={(e) => handleOptionChange(index, 'price', Number(e.target.value))}
                        />
                    </div>

                    <div>
                        <label>할인금액:</label>
                        <input 
                            type="number"
                            placeholder="할인금액"
                            value={opt.salePrice}
                            onChange={(e) => handleOptionChange(index, 'salePrice', Number(e.target.value))}
                        />
                    </div>

                    <div>
                        <label>재고:</label>
                            <input 
                            type="number"
                            placeholder="재고"
                            value={opt.stock}
                            onChange={(e) => handleOptionChange(index, 'stock', Number(e.target.value))}
                        />
                    </div>

                    <div>
                        <label>상태:</label>
                        <select
                            value={opt.status}
                            onChange={(e) => handleOptionChange(index, 'status', e.target.value)}
                        >
                            {PRODUCT_STATUS_OPTIONS.map((status) => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="button" onClick={() => removeOption(index)}>삭제</button>
                    
                    <hr/>
                </div>
            ))}
            
            <button type="button" onClick={addOption}>+ 옵션 추가</button>
        </div>
    );
};