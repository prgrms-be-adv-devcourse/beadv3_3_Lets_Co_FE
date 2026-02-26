import { active } from "../../api/assistant";

function ActiveButton() {

    const handleActive = async() => {
        try {
            await active();
        } catch (error) {
            console.log("챗봇 기능 활성화 실패");
            alert("챗봇 기능 활성화에 실패했습니다. 잠시후에 시도해주세요.");
        }
    }

    return(
        <button onClick={handleActive}>ChatBot 활성화</button>
    );
}

export default ActiveButton;
