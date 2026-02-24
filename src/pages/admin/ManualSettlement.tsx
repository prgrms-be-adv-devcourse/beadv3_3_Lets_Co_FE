import type { FormEvent } from "react";
import { manualSettlement } from "../../api/settlementApi";

function ManualSettlement() {

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        try {
            const response = await manualSettlement();
            console.log(response.data);

            alert("정산이 완료되었습니다.");
        } catch (error) {
            alert("정산 처리에 실패했습니다.");
        }
    };

    return (
        <div>
            <h1>수동으로 현재까지의 정산을 처리합니다. (Admin)</h1>

            <form onSubmit={handleSubmit}>
                <button type="submit">
                    정산 처리
                </button>
            </form>
        </div>
    );
}

export default ManualSettlement;