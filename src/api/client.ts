import axios from "axios";

// 1. 개발 모드일 땐 '' (빈 문자열) -> Vite Proxy가 처리
// 2. 배포 모드일 땐 .env.production에 적힌 주소 사용 -> 백엔드로 직접 요청
const baseURL = import.meta.env.VITE_API_BASE_URL || '';

const client = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true
});

export default client;