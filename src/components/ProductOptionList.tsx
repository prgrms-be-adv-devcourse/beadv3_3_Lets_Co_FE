import type { ProductOptionInfo } from "../types/ProductOptionInfo";

export default function ProductOptionList({ options }: { options: ProductOptionInfo[] }) {
    if (!options || options.length === 0) {
        return <div>등록된 옵션이 없습니다.</div>;
    }

    return (
        <div>
            <h3>옵션 리스트</h3>
            <table>
                <thead>
                    <tr>
                        <th>코드(테스트용)</th> 
                        <th>옵션명</th>
                        <th>가격</th>
                        <th>할인가</th>
                        <th>재고</th>
                        <th>상태</th>
                    </tr>
                </thead>
                <tbody>
                    {options.map((opt, index) => (
                        <tr key={index}>
                            <td>[{opt.code}]</td>
                            <td>{opt.name}</td>
                            <td>{opt.price.toLocaleString()}원</td>
                            <td>
                                {opt.salePrice > 0 ? `${opt.salePrice.toLocaleString()}원` : '-'}
                            </td>
                            <td>{opt.stock}개</td>
                            <td>
                                <span>
                                    {opt.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}