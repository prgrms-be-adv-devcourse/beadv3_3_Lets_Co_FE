import type { Dispatch, SetStateAction } from "react";
import type { ProductOptionInfo } from "../types/productOptionInfo";
import { PRODUCT_STATUS_OPTIONS } from "../types/productStatus";

interface Props {
    options: ProductOptionInfo[];
    setOptions: Dispatch<SetStateAction<ProductOptionInfo[]>>;
}

function AddProductOption({options, setOptions}: Props) {

    const handleOptionChange = (index: number, field: keyof ProductOptionInfo, value: any) => {
        const newOptions = [...options];
        (newOptions[index] as any)[field] = value; 
        setOptions(newOptions);
    };

    const addOption = () => {
        const newOption: ProductOptionInfo = {
            code: '',
            name: '',
            sortOrder: options.length + 1,
            price: 0,
            salePrice: 0,
            stock: 0,
            status: 'ON_SALE'
        };
        setOptions([...options, newOption]);
    };

    const removeOption = (index: number) => {
        if (options.length <= 1) {
            alert("옵션은 최소 1개가 필수입니다.");
            return;
        }

        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
    };

    return (
        <div>
            <div>
            <h3>옵션 정보</h3>
            <button type="button" onClick={addOption}>+ 옵션 추가</button>
            </div>

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
                            value={opt.sortOrder}
                            onChange={(e) => handleOptionChange(index, 'sortOrder', Number(e.target.value))}
                        />
                    </div>

                    <div>
                        <label>금액:</label>
                        <input 
                            type="number"
                            value={opt.price}
                            onChange={(e) => handleOptionChange(index, 'price', Number(e.target.value))}
                        />
                    </div>

                    <div>
                        <label>할인금액:</label>
                        <input 
                            type="number"
                            value={opt.salePrice}
                            onChange={(e) => handleOptionChange(index, 'salePrice', Number(e.target.value))}
                        />
                    </div>

                    <div>
                        <label>재고:</label>
                        <input 
                            type="number"
                            value={opt.stock}
                            onChange={(e) => handleOptionChange(index, 'stock', Number(e.target.value))}
                            min="0"
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
        </div>
    );
};

export default AddProductOption;